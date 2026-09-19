"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { EditableTextItem } from "@/components/cms/WebsiteCopyRuntime";
import { editableWebsitePages } from "@/lib/cms/websiteText";
import { updateCompleteWebsiteText, type ContentActionState } from "./actions";

const initialState: ContentActionState = { status: "idle", message: "" };

function fieldLabel(item: EditableTextItem, index: number) {
  const labels: Record<string, string> = {
    h1: "Main heading",
    h2: "Section heading",
    h3: "Subheading",
    p: "Paragraph",
    a: "Link or button",
    button: "Button",
    li: "List item",
    strong: "Highlighted text",
    small: "Supporting text",
    label: "Form label",
    summary: "Expandable section title",
    "input placeholder": "Form placeholder",
    "textarea placeholder": "Form placeholder",
    option: "Form option",
  };
  return `${labels[item.element] ?? "Website text"} ${index + 1}`;
}

export default function CompleteWebsiteTextEditor() {
  const [state, action, pending] = useActionState(updateCompleteWebsiteText, initialState);
  const [path, setPath] = useState("/");
  const [items, setItems] = useState<EditableTextItem[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.source !== "gaf-cms" ||
        event.data?.type !== "text-items" ||
        event.data?.path !== path ||
        !Array.isArray(event.data?.items)
      ) return;
      const nextItems = event.data.items as EditableTextItem[];
      setItems(nextItems);
      setValues(Object.fromEntries(nextItems.map((item) => [item.key, item.value])));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [path]);

  const changes = useMemo(
    () => items.map((item) => ({
      key: item.key,
      scope: item.scope,
      fallback: item.fallback,
      value: values[item.key] ?? item.value,
    })),
    [items, values],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      `${item.fallback} ${values[item.key] ?? ""}`.toLowerCase().includes(query),
    );
  }, [items, search, values]);

  function updatePreview(item: EditableTextItem, value: string) {
    setValues((current) => ({ ...current, [item.key]: value }));
    iframeRef.current?.contentWindow?.postMessage(
      { source: "gaf-cms-admin", type: "preview-text", key: item.key, value },
      window.location.origin,
    );
  }

  return (
    <form action={action} className="admin-card admin-form admin-complete-copy-editor">
      <div className="admin-card-heading">
        <div><p>Complete wording control</p><h2>Edit every word on a page</h2></div>
        <span className="admin-status admin-status-live">Plain text only</span>
      </div>
      <p className="admin-editor-intro">
        Choose a page, edit its visible wording below and watch the preview update immediately.
        Navigation and footer changes apply across the whole website. Code, scripts and HTML cannot be entered here.
      </p>

      <div className="admin-copy-toolbar">
        <label>
          Page to edit
          <select
            value={path}
            onChange={(event) => { setPath(event.target.value); setItems([]); setSearch(""); }}
          >
            {editableWebsitePages.map((page) => (
              <option key={page.path} value={page.path}>{page.label}</option>
            ))}
          </select>
        </label>
        <label>
          Find wording on this page
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search headings, paragraphs or buttons"
          />
        </label>
      </div>

      <div className="admin-live-page-preview">
        <div><strong>Live page preview</strong><span>{path}</span></div>
        <iframe
          ref={iframeRef}
          key={path}
          src={`${path}?cms-preview=1`}
          title={`Preview of ${path}`}
        />
      </div>

      <input type="hidden" name="pagePath" value={path} />
      <input type="hidden" name="changes" value={JSON.stringify(changes)} />

      <div className="admin-copy-field-heading">
        <div><strong>Editable wording</strong><span>{items.length ? `${items.length} text fields found` : "Loading page wording…"}</span></div>
        {search && <span>{filteredItems.length} matching fields</span>}
      </div>

      <div className="admin-copy-fields">
        {filteredItems.map((item, index) => {
          const value = values[item.key] ?? item.value;
          const changed = value !== item.fallback;
          return (
            <label className={`admin-copy-field${changed ? " admin-copy-field-changed" : ""}`} key={item.key}>
              <span>
                <strong>{fieldLabel(item, index)}</strong>
                <em>{item.scope === "global" ? "All pages" : "This page"}</em>
              </span>
              <textarea
                value={value}
                onChange={(event) => updatePreview(item, event.target.value)}
                rows={Math.min(6, Math.max(2, Math.ceil(value.length / 90)))}
                maxLength={2000}
              />
              <span className="admin-copy-field-footer">
                <small>{changed ? "Changed from the original website wording" : "Using original wording"}</small>
                {changed && (
                  <button type="button" onClick={() => updatePreview(item, item.fallback)}>
                    Restore original
                  </button>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
      <div className="admin-form-actions admin-sticky-actions">
        <a href={path} target="_blank" rel="noreferrer" className="admin-secondary-button">Open full page</a>
        <button className="admin-primary-button" type="submit" disabled={pending || items.length === 0}>
          {pending ? "Publishing…" : "Save and publish all wording"}
        </button>
      </div>
    </form>
  );
}
