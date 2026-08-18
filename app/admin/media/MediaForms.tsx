"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  deleteImage,
  quickReplaceWebsiteImage,
  replaceImage,
  uploadImage,
  updateImage,
  updateWebsiteImages,
  type MediaActionState,
  type QuickImageTarget,
} from "./actions";
import {
  pageGalleryDetails,
  pageGalleryKeys,
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
      <fieldset className="admin-upload-destinations">
        <legend>Add this photograph to pages <span className="admin-optional">Optional</span></legend>
        <p>
          Choose one or several pages. The photograph will be published in the photo gallery
          section on every selected page. You can add up to 24 photographs per page.
        </p>
        <div className="admin-destination-grid">
          {pageGalleryKeys.map((key) => (
            <label className="admin-destination-choice" key={key}>
              <input name="destinations" type="checkbox" value={key} />
              <span><strong>{pageGalleryDetails[key].label}</strong><small>{pageGalleryDetails[key].path}</small></span>
            </label>
          ))}
        </div>
      </fieldset>
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

function PlacementImageButton({
  src,
  alt,
  label,
  onClick,
}: {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="admin-placement-image-button"
      type="button"
      onClick={onClick}
      aria-label={`Replace ${label}`}
    >
      <Image src={src} alt={alt} width={720} height={450} unoptimized />
      <span><strong>Click photograph to replace</strong><small>JPG, PNG or WebP</small></span>
    </button>
  );
}

function QuickReplacePanel({
  target,
  label,
  currentAlt,
  onClose,
}: {
  target: QuickImageTarget;
  label: string;
  currentAlt: string;
  onClose: () => void;
}) {
  const actionWithTarget = quickReplaceWebsiteImage.bind(null, target);
  const [state, action, pending] = useActionState(actionWithTarget, initialState);

  return (
    <div className="admin-quick-replace-backdrop" role="presentation">
      <section className="admin-quick-replace-panel" role="dialog" aria-modal="true" aria-labelledby="quick-replace-heading">
        <div className="admin-card-heading">
          <div><p>Direct replacement</p><h2 id="quick-replace-heading">Replace {label}</h2></div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close replacement panel">×</button>
        </div>
        <form action={action} className="admin-form" encType="multipart/form-data">
          <label>
            New photograph
            <input name="quickFile" type="file" accept="image/jpeg,image/png,image/webp" required autoFocus />
            <small>JPG, PNG or WebP. Maximum file size 5 MB.</small>
          </label>
          <label>
            Image description
            <input name="quickAltText" defaultValue={currentAlt} maxLength={180} required />
            <small>Briefly describe what is visible for visitors using screen readers.</small>
          </label>
          <label className="admin-check">
            <input name="quickConsent" type="checkbox" required />
            <span>I confirm the Foundation holds appropriate consent or permission to publish this photograph.</span>
          </label>
          {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
          <div className="admin-form-actions">
            <button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-primary-button" disabled={pending}>
              {pending ? "Replacing…" : "Upload, replace and publish"}
            </button>
          </div>
        </form>
      </section>
    </div>
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
  const [quickTarget, setQuickTarget] = useState<{
    target: QuickImageTarget;
    label: string;
    alt: string;
  } | null>(null);

  return (
    <>
    <form action={action} className="admin-card admin-form admin-image-placement-form">
      <div className="admin-card-heading">
        <div>
          <p>Images currently on the website</p>
          <h2>See, replace or hide photographs</h2>
        </div>
        <span className="admin-status admin-status-live">7 image areas</span>
      </div>

      <p className="admin-editor-intro">
        Click any photograph to upload and publish its replacement directly.
        You can also choose an existing library image or restore the original below it.
      </p>

      <div className="admin-placement-grid">
        <article className="admin-placement-card">
          <PlacementImageButton
            src={imageSource(media, hero.mediaPath, "/images/hero.jpg")}
            alt={hero.alt}
            label="homepage main photograph"
            onClick={() => setQuickTarget({ target: "hero", label: "homepage main photograph", alt: hero.alt })}
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
          <PlacementImageButton
            src={imageSource(media, story.mediaPath, "/images/child-2.jpg")}
            alt={story.alt}
            label="homepage safeguarding story photograph"
            onClick={() => setQuickTarget({ target: "story", label: "homepage safeguarding story photograph", alt: story.alt })}
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
              <PlacementImageButton
                src={imageSource(media, slot.mediaPath, details.fallbackSrc)}
                alt={slot.alt}
                label={details.label.toLowerCase()}
                onClick={() => setQuickTarget({ target: key, label: details.label.toLowerCase(), alt: slot.alt })}
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
          <div><p>Add more images</p><h2 id="gallery-editor-heading">Page photo galleries</h2></div>
          <span>Up to 24 per page</span>
        </div>
        <p className="admin-editor-intro">
          Open a page below to change its gallery title, show or hide the gallery, or add and remove photographs.
          A photograph can be used on several pages.
        </p>

        <div className="admin-page-gallery-list">
          {pageGalleryKeys.map((key) => {
            const gallery = settings.pageGalleries[key];
            const details = pageGalleryDetails[key];
            return (
              <details className="admin-page-gallery" key={key} open={key === "stories"}>
                <summary>
                  <span><strong>{details.label}</strong><small>{details.path}</small></span>
                  <em>{gallery.mediaPaths.length} {gallery.mediaPaths.length === 1 ? "photo" : "photos"}</em>
                </summary>
                <div className="admin-page-gallery-content">
                  <div className="admin-form-grid">
                    <label>
                      Gallery heading
                      <input
                        name={`${key}_gallery_title`}
                        defaultValue={gallery.title}
                        maxLength={100}
                        required
                      />
                    </label>
                    <label className="admin-check admin-gallery-visible">
                      <input
                        name={`${key}_gallery_visible`}
                        type="checkbox"
                        defaultChecked={gallery.visible}
                      />
                      <span>Show this photo gallery on {details.label}</span>
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
                              name={`${key}_gallery_mediaPath`}
                              type="checkbox"
                              value={item.storage_path}
                              defaultChecked={gallery.mediaPaths.includes(item.storage_path)}
                            />
                            <strong>{item.original_name}</strong>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty-state admin-empty-state-compact">
                      Upload and publish photographs below; they will then appear here.
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {state.message && <p className={`admin-message admin-message-${state.status}`} role="status">{state.message}</p>}
      <div className="admin-form-actions admin-sticky-actions">
        <a href="/" target="_blank" rel="noreferrer" className="admin-secondary-button">Preview website</a>
        <button className="admin-primary-button" type="submit" disabled={pending}>
          {pending ? "Publishing…" : "Save and publish images"}
        </button>
      </div>
    </form>
    {quickTarget && (
      <QuickReplacePanel
        key={quickTarget.target}
        target={quickTarget.target}
        label={quickTarget.label}
        currentAlt={quickTarget.alt}
        onClose={() => setQuickTarget(null)}
      />
    )}
    </>
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
