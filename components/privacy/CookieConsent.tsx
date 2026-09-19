"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "gaf-cookie-consent-v1";
const OPEN_SETTINGS_EVENT = "gaf:open-cookie-settings";

type ConsentMode = "notice" | "settings" | null;

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function readPreferences(): CookiePreferences | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<CookiePreferences>;
    if (parsed.necessary !== true) return null;

    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [mode, setMode] = useState<ConsentMode>(null);
  const [hasSavedChoice, setHasSavedChoice] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cms-preview") === "1") {
      return;
    }

    const initialiseTimer = window.setTimeout(() => {
      const preferences = readPreferences();
      if (preferences) {
        setHasSavedChoice(true);
        setAnalytics(preferences.analytics);
        setMarketing(preferences.marketing);
      } else {
        setMode("notice");
      }
    }, 0);

    const openSettings = () => {
      const latest = readPreferences();
      setHasSavedChoice(Boolean(latest));
      setAnalytics(latest?.analytics ?? false);
      setMarketing(latest?.marketing ?? false);
      setMode("settings");
    };

    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => {
      window.clearTimeout(initialiseTimer);
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
    };
  }, []);

  useEffect(() => {
    if (!mode) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mode]);

  function savePreferences(nextAnalytics: boolean, nextMarketing: boolean) {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // The choice still applies for this page view when browser storage is unavailable.
    }

    window.dispatchEvent(
      new CustomEvent("gaf:cookie-consent", { detail: preferences }),
    );
    setHasSavedChoice(true);
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setMode(null);
  }

  function closeSettings() {
    if (hasSavedChoice) setMode(null);
    else setMode("notice");
  }

  if (!mounted || !mode) return null;

  return (
    <div className="cookie-consent-backdrop">
      <section
        className="cookie-consent-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
      >
        {mode === "notice" ? (
          <>
            <div className="cookie-consent-copy">
              <p className="section-eyebrow">Your privacy</p>
              <h2 id="cookie-consent-title">Our cookies</h2>
              <p id="cookie-consent-description">
                We use essential cookies to keep administrator sign-in secure.
                We do not currently use advertising or analytics cookies. You
                can accept optional cookies, reject them, or review each choice.
                Read our <Link href="/cookies">Cookie Information</Link>.
              </p>
            </div>

            <div className="cookie-consent-actions">
              <button
                type="button"
                className="cookie-consent-primary"
                onClick={() => savePreferences(true, true)}
              >
                Accept optional cookies
              </button>
              <button
                type="button"
                className="cookie-consent-primary"
                onClick={() => savePreferences(false, false)}
              >
                Reject optional cookies
              </button>
              <button
                type="button"
                className="cookie-consent-secondary"
                onClick={() => setMode("settings")}
              >
                Manage cookies
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-settings-content">
            <div className="cookie-settings-heading">
              <div>
                <p className="section-eyebrow">Privacy controls</p>
                <h2 id="cookie-consent-title">Manage cookies</h2>
              </div>
              <button
                type="button"
                className="cookie-settings-close"
                onClick={closeSettings}
                aria-label="Close cookie settings"
              >
                ×
              </button>
            </div>

            <p id="cookie-consent-description" className="cookie-settings-intro">
              Essential cookies cannot be switched off because they protect
              secure administrator sessions. Optional categories are not
              currently active on this website.
            </p>

            <div className="cookie-preference-list">
              <div className="cookie-preference-row">
                <div>
                  <strong>Strictly necessary</strong>
                  <span>Security and administrator authentication.</span>
                </div>
                <span className="cookie-always-on">Always on</span>
              </div>

              <label className="cookie-preference-row">
                <span>
                  <strong>Analytics</strong>
                  <span>Helps understand website use if introduced later.</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
              </label>

              <label className="cookie-preference-row">
                <span>
                  <strong>Marketing</strong>
                  <span>Allows relevant campaign measurement if introduced later.</span>
                </span>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
              </label>
            </div>

            <div className="cookie-settings-actions">
              <button
                type="button"
                className="cookie-consent-primary"
                onClick={() => savePreferences(analytics, marketing)}
              >
                Save my choices
              </button>
              <button
                type="button"
                className="cookie-consent-secondary"
                onClick={() => savePreferences(false, false)}
              >
                Reject optional cookies
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
