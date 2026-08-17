"use client";

import { useActionState } from "react";
import Image from "next/image";
import { publicMediaUrl } from "@/lib/cms/home";
import { uploadImage, updateImage, type MediaActionState } from "./actions";

const initialState: MediaActionState = { status: "idle", message: "" };

export function MediaUploadForm() {
  const [state, action, pending] = useActionState(uploadImage, initialState);

  return (
    <form action={action} className="admin-card admin-form" encType="multipart/form-data">
      <div className="admin-card-heading">
        <div><p>Media library</p><h2>Add a photograph</h2></div>
      </div>

      <label>
        Image file
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required />
        <small>JPG, PNG or WebP. Maximum file size 5 MB.</small>
      </label>
      <label>
        Image description
        <input name="altText" maxLength={180} required />
        <small>Describe what matters in the image; do not identify vulnerable people unnecessarily.</small>
      </label>
      <label>
        Caption <span className="admin-optional">Optional</span>
        <textarea name="caption" rows={3} maxLength={300} />
      </label>
      <label className="admin-check">
        <input name="consentConfirmed" type="checkbox" required />
        <span>I confirm the Foundation holds appropriate consent or permission to use this image.</span>
      </label>
      <label className="admin-check">
        <input name="publish" type="checkbox" />
        <span>Make this image available on the public website immediately.</span>
      </label>

      {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
      <div className="admin-form-actions">
        <button className="admin-primary-button" type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Upload image"}
        </button>
      </div>
    </form>
  );
}

type MediaItem = {
  id: string;
  storage_path: string;
  original_name: string;
  alt_text: string;
  caption: string | null;
  is_published: boolean;
};

export function MediaCard({ item }: { item: MediaItem }) {
  const actionWithId = updateImage.bind(null, item.id);
  const [state, action, pending] = useActionState(actionWithId, initialState);
  const imageUrl = publicMediaUrl(item.storage_path);

  return (
    <article className="admin-media-card">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={item.alt_text}
          width={720}
          height={450}
          unoptimized
        />
      )}
      <form action={action} className="admin-media-card-form">
        <div className="admin-media-meta">
          <strong>{item.original_name}</strong>
          <span className={`admin-status ${item.is_published ? "admin-status-live" : "admin-status-draft"}`}>
            {item.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <label>
          Description
          <input name="altText" defaultValue={item.alt_text} maxLength={180} required />
        </label>
        <label>
          Caption
          <textarea name="caption" defaultValue={item.caption ?? ""} rows={2} maxLength={300} />
        </label>
        <label className="admin-check">
          <input name="isPublished" type="checkbox" defaultChecked={item.is_published} />
          <span>Published</span>
        </label>
        {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
        <button className="admin-secondary-button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save details"}
        </button>
      </form>
    </article>
  );
}
