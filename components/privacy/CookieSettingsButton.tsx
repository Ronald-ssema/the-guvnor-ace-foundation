"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="compact-footer-cookie-button"
      onClick={() => window.dispatchEvent(new Event("gaf:open-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}

