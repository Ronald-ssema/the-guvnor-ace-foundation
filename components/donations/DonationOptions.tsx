"use client";

import { useState } from "react";

import type { SiteEditorSettings } from "@/lib/cms/siteEditor";

function donationOptions(donations: SiteEditorSettings["donations"]) {
return [
  {
    name: "PayPal",
    label: "Fast online donation",
    description:
      "Donate securely by card or PayPal from the UK or internationally.",
    href: donations.paypal,
    action: "Donate with PayPal",
    symbol: "P",
    featured: true,
    type: "external" as const,
  },
  {
    name: "GoFundMe",
    label: "Official campaign",
    description:
      "Support our official fundraising campaign and follow campaign updates.",
    href: donations.goFundMe,
    action: "Donate on GoFundMe",
    symbol: "G",
    featured: false,
    type: "external" as const,
  },
  {
    name: "Airtel Money",
    label: "Mobile money donation",
    description:
      "Send your contribution directly through Airtel Money in Uganda.",
    action: "Copy Airtel Number",
    symbol: "A",
    featured: false,
    type: "airtel" as const,
  },
];
}

export default function DonationOptions({
  donations,
}: {
  donations: SiteEditorSettings["donations"];
}) {
  const [copied, setCopied] = useState(false);

  const copyAirtelNumber = async () => {
    try {
      await navigator.clipboard.writeText(donations.airtelNumber);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="donation-options-grid">
      {donationOptions(donations).map((option) => {
        const isAirtel = option.type === "airtel";

        return (
          <article
            className={
              [
                "donation-option-card",
                option.featured ? "donation-option-featured" : "",
                isAirtel ? "donation-option-airtel" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            key={option.name}
          >
            {option.featured && (
              <span className="donation-recommended">Recommended</span>
            )}

            <div className="donation-option-icon" aria-hidden="true">
              {option.symbol}
            </div>

            <p className="donation-option-label">{option.label}</p>

            <h3>{option.name}</h3>

            <p className="donation-option-description">
              {option.description}
            </p>

            {isAirtel && (
              <div className="airtel-donation-details">
                <div>
                  <span>Send your contribution to</span>
                  <strong>{donations.airtelNumber}</strong>
                </div>

                <div>
                  <span>Account name</span>
                  <strong>{donations.airtelAccountName}</strong>
                </div>

                <p>
                  Please keep your transaction confirmation for accountability
                  and receipt enquiries.
                </p>
              </div>
            )}

            {isAirtel ? (
              <button
                type="button"
                className="secondary-button donation-option-button airtel-copy-button"
                onClick={copyAirtelNumber}
                aria-live="polite"
              >
                {copied ? "Number Copied" : option.action}
                <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
              </button>
            ) : (
              <a
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  option.featured
                    ? "primary-button donation-option-button"
                    : "secondary-button donation-option-button"
                }
              >
                {option.action}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
