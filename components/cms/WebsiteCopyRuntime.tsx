"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import type { WebsiteTextSettings } from "@/lib/cms/websiteText";

export type EditableTextItem = {
  key: string;
  scope: "page" | "global";
  fallback: string;
  value: string;
  element: string;
};

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function normaliseText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function collectText(
  root: HTMLElement,
  scopeName: string,
  scope: "page" | "global",
  overrides: Record<string, string>,
) {
  const occurrences = new Map<string, number>();
  const setters = new Map<string, (value: string) => void>();
  const items: EditableTextItem[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    const fallback = normaliseText(node.textContent ?? "");
    if (
      !parent ||
      !fallback ||
      parent.closest("[data-cms-ignore]") ||
      ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"].includes(parent.tagName) ||
      parent.getAttribute("aria-hidden") === "true"
    ) continue;

    const hash = hashText(fallback);
    const occurrence = occurrences.get(hash) ?? 0;
    occurrences.set(hash, occurrence + 1);
    const key = `${scopeName}:${hash}:${occurrence}`;
    const value = Object.prototype.hasOwnProperty.call(overrides, key)
      ? overrides[key]
      : fallback;
    const raw = node.textContent ?? "";
    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const trailing = raw.match(/\s*$/)?.[0] ?? "";
    const setValue = (nextValue: string) => {
      node.textContent = `${leading}${nextValue}${trailing}`;
    };
    setValue(value);
    setters.set(key, setValue);
    items.push({ key, scope, fallback, value, element: parent.tagName.toLowerCase() });
  }

  root.querySelectorAll<HTMLElement>("[placeholder]").forEach((element) => {
    const fallback = normaliseText(element.getAttribute("placeholder") ?? "");
    if (!fallback || element.closest("[data-cms-ignore]")) return;
    const hash = hashText(fallback);
    const occurrence = occurrences.get(hash) ?? 0;
    occurrences.set(hash, occurrence + 1);
    const key = `${scopeName}:${hash}:${occurrence}`;
    const value = Object.prototype.hasOwnProperty.call(overrides, key)
      ? overrides[key]
      : fallback;
    const setValue = (nextValue: string) => element.setAttribute("placeholder", nextValue);
    setValue(value);
    setters.set(key, setValue);
    items.push({ key, scope, fallback, value, element: `${element.tagName.toLowerCase()} placeholder` });
  });

  return { items, setters };
}

export default function WebsiteCopyRuntime({ settings }: { settings: WebsiteTextSettings }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const pageOverrides = settings.pages[pathname] ?? {};
    const pageRoot = document.querySelector<HTMLElement>('[data-cms-scope="page"]');
    const globalRoots = document.querySelectorAll<HTMLElement>('[data-cms-scope^="global-"]');
    const setterMap = new Map<string, (value: string) => void>();
    const items: EditableTextItem[] = [];

    if (pageRoot) {
      const collected = collectText(pageRoot, "page", "page", pageOverrides);
      collected.items.forEach((item) => items.push(item));
      collected.setters.forEach((setter, key) => setterMap.set(key, setter));
    }

    globalRoots.forEach((root) => {
      const scopeName = root.dataset.cmsScope ?? "global";
      const collected = collectText(root, scopeName, "global", settings.global);
      collected.items.forEach((item) => items.push(item));
      collected.setters.forEach((setter, key) => setterMap.set(key, setter));
    });

    const preview = new URLSearchParams(window.location.search).get("cms-preview") === "1";
    if (preview && window.parent !== window) {
      window.parent.postMessage(
        { source: "gaf-cms", type: "text-items", path: pathname, items },
        window.location.origin,
      );
    }

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.source !== "gaf-cms-admin" ||
        event.data?.type !== "preview-text"
      ) return;
      const setter = setterMap.get(String(event.data.key ?? ""));
      if (setter && typeof event.data.value === "string") setter(event.data.value);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pathname, settings]);

  return null;
}
