import { useState } from "react";

import { supportLinks } from "@/lib/supportLinks";

const AIRTEL_NUMBER = "+256 752 462 740";

const donationOptions = [
  {
    name: "GoFundMe",
    label: "Primary campaign",
    description:
      "Support our official fundraising campaign and follow campaign updates.",
    href: supportLinks.goFundMe,
    action: "Donate via GoFundMe",
    symbol: "G",
    featured: true,
    type: "external" as const,
  },
  {
    name: "PayPal",
    label: "Secure online donation",
    description:
      "Make a secure PayPal donation from the UK or internationally.",
    href: supportLinks.paypal,
    action: "Donate with PayPal",
    symbol: "P",
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
  {
    name: "More Ways to Support",
    label: "Foundation Linktree",
    description:
      "Explore our official channels, campaigns and other ways to help.",
    href: supportLinks.linktree,
    action: "Visit our Linktree",
    symbol: "+",
    featured: false,
    type: "external" as const,
  },
];

export default function DonationOptions() {
  const [copied, setCopied] = useState(false);

  const copyAirtelNumber = async () => {
    try {
      await navigator.clipboard.writeText(AIRTEL_NUMBER);
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
      {donationOptions.map((option) => {
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
                  <strong>{AIRTEL_NUMBER}</strong>
                </div>

                <div>
                  <span>Account name</span>
                  <strong>Ssemawere Ronald</strong>
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
