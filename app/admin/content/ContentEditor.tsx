"use client";

import { useActionState } from "react";
import type { HomeHeroContent } from "@/lib/cms/home";
import { updateHomeHero, type ContentActionState } from "./actions";

type MediaOption = {
  storage_path: string;
  original_name: string;
  alt_text: string;
};

const initialState: ContentActionState = { status: "idle", message: "" };

export default function ContentEditor({
  hero,
  media,
}: {
  hero: HomeHeroContent;
  media: MediaOption[];
}) {
  const [state, action, pending] = useActionState(updateHomeHero, initialState);

  return (
    <form action={action} className="admin-card admin-form">
      <div className="admin-card-heading">
        <div>
          <p>Homepage</p>
          <h2>Hero section</h2>
        </div>
        <span className="admin-status admin-status-live">Published</span>
      </div>

      <label>
        Eyebrow text
        <input name="kicker" defaultValue={hero.kicker} maxLength={100} required />
        <small>A short introduction above the main heading.</small>
      </label>

      <label>
        Main heading
        <input name="title" defaultValue={hero.title} maxLength={120} required />
      </label>

      <label>
        Introduction
        <textarea
          name="description"
          defaultValue={hero.description}
          maxLength={520}
          rows={6}
          required
        />
      </label>

      <div className="admin-form-grid">
        <label>
          Hero image
          <select name="imagePath" defaultValue={hero.imagePath ?? ""}>
            <option value="">Use the original website image</option>
            {media.map((item) => (
              <option key={item.storage_path} value={item.storage_path}>
                {item.original_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image description
          <input name="imageAlt" defaultValue={hero.imageAlt} maxLength={180} required />
          <small>Describe the image for visitors using screen readers.</small>
        </label>
      </div>

      {state.message && (
        <p className={`admin-message admin-message-${state.status}`} role="status">
          {state.message}
        </p>
      )}

      <div className="admin-form-actions">
        <a href="/" target="_blank" rel="noreferrer" className="admin-secondary-button">
          Preview website
        </a>
        <button type="submit" disabled={pending} className="admin-primary-button">
          {pending ? "Saving…" : "Save and publish"}
        </button>
      </div>
    </form>
  );
}
