"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  deleteImage,
  replaceImage,
  uploadImage,
  updateImage,
  updateWebsiteImages,
  type MediaActionState,
} from "./actions";
import {
  websiteImageSlotDetails,
  websiteImageSlotKeys,
  type WebsiteImageSettings,
} from "@/lib/cms/websiteImages";

const initialState: MediaActionState = { status: "idle", message: "" };

export function MediaUploadForm() {
  const [state, action, pending] = useActionState(uploadImage, initialState);

  return (
    <form action={action} className="admin-card admin-form admin-upload-card" encType="multipart/form-data">
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
  image_url: string | null;
};

type EligibleMediaItem = MediaItem & {
  consent_confirmed?: boolean;
  safeguarding_reviewed_at?: string | null;
};

type FeaturedImage = {
  mediaPath: string | null;
  alt: string;
};

function imageSource(media: EligibleMediaItem[], mediaPath: string | null, fallback: string) {
  return media.find((item) => item.storage_path === mediaPath)?.image_url ?? fallback;
}

function ImageChoice({
  name,
  currentPath,
  media,
}: {
  name: string;
  currentPath: string | null;
  media: EligibleMediaItem[];
}) {
  return (
    <select name={name} defaultValue={currentPath ?? ""}>
      <option value="">Keep the original website photograph</option>
      {media.map((item) => (
        <option value={item.storage_path} key={item.storage_path}>
          {item.original_name} — {item.alt_text}
        </option>
      ))}
    </select>
  );
}

export function WebsiteImageManager({
  media,
  settings,
  hero,
  story,
}: {
  media: EligibleMediaItem[];
  settings: WebsiteImageSettings;
  hero: FeaturedImage;
  story: FeaturedImage;
}) {
  const [state, action, pending] = useActionState(updateWebsiteImages, initialState);

  return (
    <form action={action} className="admin-card admin-form admin-image-placement-form">
      <div className="admin-card-heading">
        <div>
          <p>Images currently on the website</p>
          <h2>See, replace or hide photographs</h2>
        </div>
        <span className="admin-status admin-status-live">7 image areas</span>
      </div>

      <p className="admin-editor-intro">
        Every card below names the pages where the photograph appears. Choose a
        published upload to replace it, or choose the original to restore it.
      </p>

      <div className="admin-placement-grid">
        <article className="admin-placement-card">
          <Image
            src={imageSource(media, hero.mediaPath, "/images/hero.jpg")}
            alt={hero.alt}
            width={720}
            height={450}
            unoptimized
          />
          <div className="admin-placement-card-body">
            <div><strong>Homepage main photograph</strong><span>Homepage hero</span></div>
            <label>
              Photograph
              <ImageChoice name="hero_imagePath" currentPath={hero.mediaPath} media={media} />
            </label>
            <label>
              Image description
              <input name="hero_alt" defaultValue={hero.alt} maxLength={180} required />
            </label>
          </div>
        </article>

        <article className="admin-placement-card">
          <Image
            src={imageSource(media, story.mediaPath, "/images/child-2.jpg")}
            alt={story.alt}
            width={720}
            height={450}
            unoptimized
          />
          <div className="admin-placement-card-body">
            <div><strong>Homepage safeguarding story</strong><span>Homepage story section</span></div>
            <label>
              Photograph
              <ImageChoice name="story_imagePath" currentPath={story.mediaPath} media={media} />
            </label>
            <label>
              Image description
              <input name="story_alt" defaultValue={story.alt} maxLength={180} required />
            </label>
          </div>
        </article>

        {websiteImageSlotKeys.map((key) => {
          const slot = settings.slots[key];
          const details = websiteImageSlotDetails[key];
          return (
            <article className="admin-placement-card" key={key}>
              <Image
                src={imageSource(media, slot.mediaPath, details.fallbackSrc)}
                alt={slot.alt}
                width={720}
                height={450}
                unoptimized
              />
              <div className="admin-placement-card-body">
                <div><strong>{details.label}</strong><span>{details.usedOn}</span></div>
                <label>
                  Photograph
                  <ImageChoice name={`${key}_mediaPath`} currentPath={slot.mediaPath} media={media} />
                </label>
                <label>
                  Image description
                  <input name={`${key}_alt`} defaultValue={slot.alt} maxLength={180} required />
                </label>
                <label className="admin-check">
                  <input name={`${key}_visible`} type="checkbox" defaultChecked={slot.visible} />
                  <span>Show this photograph on the public website</span>
                </label>
              </div>
            </article>
          );
        })}
      </div>

      <section className="admin-gallery-editor" aria-labelledby="gallery-editor-heading">
        <div className="admin-section-heading">
          <div><p>Add more images</p><h2 id="gallery-editor-heading">Public photo gallery</h2></div>
          <span>{settings.gallery.mediaPaths.length} selected</span>
        </div>
        <div className="admin-form-grid">
          <label>
            Gallery heading
            <input name="gallery_title" defaultValue={settings.gallery.title} maxLength={100} required />
          </label>
          <label className="admin-check admin-gallery-visible">
            <input name="gallery_visible" type="checkbox" defaultChecked={settings.gallery.visible} />
            <span>Show the gallery on the Stories page</span>
          </label>
        </div>

        {media.length ? (
          <div className="admin-gallery-choice-grid">
            {media.map((item) => (
              <label className="admin-gallery-choice" key={item.storage_path}>
                {item.image_url && (
                  <Image src={item.image_url} alt={item.alt_text} width={420} height={280} unoptimized />
                )}
                <span>
                  <input
                    name="gallery_mediaPath"
                    type="checkbox"
                    value={item.storage_path}
                    defaultChecked={settings.gallery.mediaPaths.includes(item.storage_path)}
                  />
                  <strong>{item.original_name}</strong>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state admin-empty-state-compact">
            Upload and publish photographs below; they will then appear here for you to add to the gallery.
          </div>
        )}
      </section>

      {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
      <div className="admin-form-actions admin-sticky-actions">
        <a href="/stories" target="_blank" rel="noreferrer" className="admin-secondary-button">Preview stories</a>
        <button className="admin-primary-button" type="submit" disabled={pending}>
          {pending ? "Publishing…" : "Save and publish images"}
        </button>
      </div>
    </form>
  );
}

export function MediaCard({ item }: { item: MediaItem }) {
  const actionWithId = updateImage.bind(null, item.id);
  const [state, action, pending] = useActionState(actionWithId, initialState);
  const imageUrl = item.image_url;

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
      <MediaFileControls item={item} />
    </article>
  );
}

function MediaFileControls({ item }: { item: MediaItem }) {
  const replaceWithId = replaceImage.bind(null, item.id);
  const deleteWithId = deleteImage.bind(null, item.id);
  const [replaceState, replaceAction, replacing] = useActionState(replaceWithId, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteWithId, initialState);

  return (
    <div className="admin-media-file-controls">
      <details className="admin-media-tool">
        <summary>Change this photograph</summary>
        <form action={replaceAction} className="admin-media-action-form" encType="multipart/form-data">
          <p>The new file will replace this photograph everywhere it is currently used.</p>
          <label>
            Replacement image
            <input name="replacementFile" type="file" accept="image/jpeg,image/png,image/webp" required />
            <small>JPG, PNG or WebP. Maximum file size 5 MB.</small>
          </label>
          <label className="admin-check">
            <input name="replacementConsent" type="checkbox" required />
            <span>I confirm the Foundation has permission to use this replacement image.</span>
          </label>
          {replaceState.message && (
            <p className={`admin-message admin-message-${replaceState.status}`} role="status">
              {replaceState.message}
            </p>
          )}
          <button className="admin-secondary-button" type="submit" disabled={replacing}>
            {replacing ? "Replacing…" : "Replace photograph"}
          </button>
        </form>
      </details>

      <details className="admin-media-tool admin-danger-zone">
        <summary>Delete this photograph</summary>
        <form action={deleteAction} className="admin-media-action-form">
          <p>Deletion is permanent and will be blocked if the photograph is still used on a page.</p>
          <label className="admin-check">
            <input name="confirmDelete" type="checkbox" required />
            <span>I understand that this permanently deletes the photograph.</span>
          </label>
          {deleteState.message && (
            <p className={`admin-message admin-message-${deleteState.status}`} role="status">
              {deleteState.message}
            </p>
          )}
          <button className="admin-danger-button" type="submit" disabled={deleting}>
            {deleting ? "Deleting…" : "Delete permanently"}
          </button>
        </form>
      </details>
    </div>
  );
}
