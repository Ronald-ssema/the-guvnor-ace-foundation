"use client";

import { useActionState } from "react";
import type { HomeHeroContent } from "@/lib/cms/home";
import {
  editablePageKeys,
  homeSectionKeys,
  type SiteEditorSettings,
} from "@/lib/cms/siteEditor";
import {
  updateHomeHero,
  updateVisualEditor,
  type ContentActionState,
} from "./actions";

type MediaOption = {
  storage_path: string;
  original_name: string;
  alt_text: string;
};

const initialState: ContentActionState = { status: "idle", message: "" };

export default function ContentEditor({
  hero,
  media,
  settings,
}: {
  hero: HomeHeroContent;
  media: MediaOption[];
  settings: SiteEditorSettings;
}) {
  const [heroState, heroAction, heroPending] = useActionState(
    updateHomeHero,
    initialState,
  );
  const [editorState, editorAction, editorPending] = useActionState(
    updateVisualEditor,
    initialState,
  );

  return (
    <div className="admin-editor-stack">
    <form action={heroAction} className="admin-card admin-form">
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

      {heroState.message && (
        <p className={`admin-message admin-message-${heroState.status}`} role="status">
          {heroState.message}
        </p>
      )}

      <div className="admin-form-actions">
        <a href="/" target="_blank" rel="noreferrer" className="admin-secondary-button">
          Preview website
        </a>
        <button type="submit" disabled={heroPending} className="admin-primary-button">
          {heroPending ? "Saving…" : "Save homepage hero"}
        </button>
      </div>
    </form>

    <form action={editorAction} className="admin-card admin-form admin-visual-editor">
      <div className="admin-card-heading">
        <div>
          <p>Controlled visual editing</p>
          <h2>Website content and appearance</h2>
        </div>
        <span className="admin-status admin-status-live">Safe fields only</span>
      </div>

      <p className="admin-editor-intro">
        These controls cannot run scripts or modify application code. Published
        changes use validated text, secure links and approved design presets.
      </p>

      <details className="admin-editor-group" open>
        <summary>Contact and donation details</summary>
        <div className="admin-editor-group-content">
          <div className="admin-form-grid">
            <label>
              Public email
              <input name="contact_email" type="email" defaultValue={settings.contact.email} maxLength={254} required />
            </label>
            <label>
              Telephone shown to visitors
              <input name="contact_phoneDisplay" defaultValue={settings.contact.phoneDisplay} maxLength={60} required />
            </label>
            <label>
              Telephone link
              <input name="contact_phoneHref" defaultValue={settings.contact.phoneHref} maxLength={40} required />
              <small>Use an international number such as +256752462740.</small>
            </label>
            <label>
              Public location
              <input name="contact_location" defaultValue={settings.contact.location} maxLength={220} required />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              PayPal donation link
              <input name="donations_paypal" type="url" defaultValue={settings.donations.paypal} maxLength={500} required />
            </label>
            <label>
              GoFundMe donation link
              <input name="donations_goFundMe" type="url" defaultValue={settings.donations.goFundMe} maxLength={500} required />
            </label>
            <label>
              Airtel Money number
              <input name="donations_airtelNumber" defaultValue={settings.donations.airtelNumber} maxLength={60} required />
            </label>
            <label>
              Airtel account name
              <input name="donations_airtelAccountName" defaultValue={settings.donations.airtelAccountName} maxLength={120} required />
            </label>
          </div>
        </div>
      </details>

      <details className="admin-editor-group">
        <summary>Approved colours and layout</summary>
        <div className="admin-editor-group-content admin-form-grid">
          <label>
            Accent colour
            <select name="appearance_accent" defaultValue={settings.appearance.accent}>
              <option value="gold">Foundation gold</option>
              <option value="emerald">Emerald green</option>
              <option value="blue">Community blue</option>
            </select>
            <small>Only accessible, brand-safe colour combinations are available.</small>
          </label>
          <label>
            Page spacing
            <select name="appearance_density" defaultValue={settings.appearance.density}>
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>
      </details>

      <details className="admin-editor-group">
        <summary>Page headings, text, buttons and links</summary>
        <div className="admin-editor-group-content admin-editor-list">
          {editablePageKeys.map((key) => {
            const page = settings.pages[key];
            return (
              <fieldset className="admin-editor-fieldset" key={key}>
                <legend>{page.label}</legend>
                <input type="hidden" name={`${key}_label`} value={page.label} />
                <div className="admin-form-grid">
                  <label>
                    Eyebrow text
                    <input name={`${key}_eyebrow`} defaultValue={page.eyebrow} maxLength={80} required />
                  </label>
                  <label>
                    Main heading
                    <input name={`${key}_title`} defaultValue={page.title} maxLength={140} required />
                  </label>
                </div>
                <label>
                  Introduction
                  <textarea name={`${key}_description`} defaultValue={page.description} maxLength={520} rows={4} required />
                </label>
                <div className="admin-form-grid">
                  <label>
                    Primary button text
                    <input name={`${key}_primaryLabel`} defaultValue={page.primaryLabel} maxLength={80} required />
                  </label>
                  <label>
                    Primary button link
                    <input name={`${key}_primaryHref`} defaultValue={page.primaryHref} maxLength={500} required />
                  </label>
                  <label>
                    Secondary button text
                    <input name={`${key}_secondaryLabel`} defaultValue={page.secondaryLabel} maxLength={80} required />
                  </label>
                  <label>
                    Secondary button link
                    <input name={`${key}_secondaryHref`} defaultValue={page.secondaryHref} maxLength={500} required />
                  </label>
                </div>
              </fieldset>
            );
          })}
        </div>
      </details>

      <details className="admin-editor-group">
        <summary>Homepage sections, order and visibility</summary>
        <div className="admin-editor-group-content admin-editor-list">
          {homeSectionKeys.map((key) => {
            const section = settings.homeSections[key];
            return (
              <fieldset className="admin-editor-fieldset" key={key}>
                <legend>{section.label}</legend>
                <input type="hidden" name={`${key}_label`} value={section.label} />
                <div className="admin-form-grid admin-editor-controls">
                  <label className="admin-check">
                    <input name={`${key}_visible`} type="checkbox" defaultChecked={section.visible} />
                    Show this section
                  </label>
                  <label>
                    Position
                    <select name={`${key}_order`} defaultValue={section.order}>
                      {[1, 2, 3, 4, 5].map((position) => (
                        <option value={position} key={position}>{position}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="admin-form-grid">
                  <label>
                    Eyebrow text
                    <input name={`${key}_kicker`} defaultValue={section.kicker} maxLength={80} required />
                  </label>
                  <label>
                    Heading
                    <input name={`${key}_title`} defaultValue={section.title} maxLength={140} required />
                  </label>
                </div>
                <label>
                  Section text
                  <textarea name={`${key}_body`} defaultValue={section.body} maxLength={700} rows={4} required={key !== "action"} />
                </label>

                {key === "story" && (
                  <div className="admin-form-grid">
                    <label>
                      Story photograph
                      <select name="story_imagePath" defaultValue={section.imagePath ?? ""}>
                        <option value="">Use the original website image</option>
                        {media.map((item) => (
                          <option key={item.storage_path} value={item.storage_path}>{item.original_name}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Image description
                      <input name="story_imageAlt" defaultValue={section.imageAlt} maxLength={180} required />
                    </label>
                    <label>
                      Optional caption
                      <input name="story_caption" defaultValue={section.caption} maxLength={240} />
                    </label>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>
      </details>

      {editorState.message && (
        <p className={`admin-message admin-message-${editorState.status}`} role="status">
          {editorState.message}
        </p>
      )}

      <div className="admin-form-actions admin-sticky-actions">
        <a href="/" target="_blank" rel="noreferrer" className="admin-secondary-button">Preview website</a>
        <button type="submit" disabled={editorPending} className="admin-primary-button">
          {editorPending ? "Publishing…" : "Save and publish website"}
        </button>
      </div>
    </form>
    </div>
  );
}
