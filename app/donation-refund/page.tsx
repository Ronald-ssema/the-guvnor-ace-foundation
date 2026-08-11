import { createPageMetadata } from "@/lib/seo";
import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

export const metadata = createPageMetadata({
  title: "Donation & Refund Policy",
  description:
    "How donations to The Guvnor Ace Foundation are received, processed and reviewed when a correction or refund is requested.",
  path: "/donation-refund",
});

const navigation = [
  { label: "Donating to the Foundation", href: "#donations" },
  { label: "Payment platforms", href: "#platforms" },
  { label: "Donation errors", href: "#errors" },
  { label: "Refund requests", href: "#refunds" },
  { label: "Restricted donations", href: "#restricted" },
  { label: "Fraud & chargebacks", href: "#fraud" },
  { label: "Contact", href: "#contact" },
];

export default function DonationRefundPage() {
  return (
    <PolicyPageLayout
      eyebrow="Donations"
      title="Donation & Refund Policy"
      description="How donations to The Guvnor Ace Foundation are received, processed and reviewed when a correction or refund is requested."
      lastReviewed="5 August 2026"
      navigation={navigation}
    >
      <section id="donations">
        <h2>Donating to the Foundation</h2>

        <p>
          Donations help support the charitable activities and operational
          needs of The Guvnor Ace Foundation.
        </p>

        <p>
          Donors should check the donation amount and payment details carefully
          before completing a transaction.
        </p>

        <p>
          Donations should be made only through payment methods or fundraising
          channels officially identified by the Foundation.
        </p>
      </section>

      <section id="platforms">
        <h2>Payment platforms</h2>

        <p>
          Some donations are processed by independent payment providers such as
          fundraising platforms, online payment services or mobile-money
          providers.
        </p>

        <p>
          These providers may apply their own terms, processing rules, fees,
          refund procedures and transaction timeframes.
        </p>

        <p>
          The Foundation does not directly control every part of a third-party
          payment provider&apos;s processing system.
        </p>
      </section>

      <section id="errors">
        <h2>Donation errors</h2>

        <p>
          If you believe you donated the wrong amount, submitted a duplicate
          donation or used incorrect information, please contact the Foundation
          as soon as reasonably possible.
        </p>

        <p>
          Please provide enough transaction information for the donation to be
          identified without sending passwords, PINs or full payment-card
          details.
        </p>
      </section>

      <section id="refunds">
        <h2>Refund requests</h2>

        <p>
          Donations are generally given voluntarily to support the charitable
          work of the Foundation. However, reasonable refund requests may be
          reviewed in circumstances such as:
        </p>

        <ul>
          <li>An accidental duplicate payment.</li>
          <li>An obvious error in the donation amount.</li>
          <li>An unauthorised transaction supported by credible evidence.</li>
          <li>
            Another exceptional circumstance where refunding the transaction is
            considered appropriate.
          </li>
        </ul>

        <p>
          A refund is not automatically guaranteed merely because a donor later
          changes their mind.
        </p>

        <p>
          Where a refund is approved, it should normally be returned using an
          appropriate method consistent with the original transaction and the
          rules of the relevant payment provider.
        </p>
      </section>

      <section id="restricted">
        <h2>Restricted or designated donations</h2>

        <p>
          If a donor clearly identifies a preferred programme or purpose, the
          Foundation should make reasonable efforts to respect that intention
          where the donation is accepted on that basis.
        </p>

        <p>
          Where circumstances make the intended purpose impossible,
          impractical or no longer appropriate, the Foundation may contact the
          donor where reasonably possible or consider an appropriate use that
          remains consistent with the Foundation&apos;s charitable mission.
        </p>
      </section>

      <section id="fraud">
        <h2>Fraud, disputed payments and chargebacks</h2>

        <p>
          Suspected fraudulent, unauthorised or disputed transactions may be
          reviewed with the relevant payment provider.
        </p>

        <p>
          The Foundation may provide appropriate transaction information to a
          payment provider where reasonably necessary to investigate a dispute,
          prevent fraud or protect the Foundation and its supporters.
        </p>
      </section>

      <section id="contact">
        <h2>Requesting a donation review</h2>

        <p>
          Please contact us with the donor name, approximate donation date,
          amount, payment method and the reason for your request.
        </p>

        <div className="policy-contact">
          <h3>Donation enquiries</h3>
          <p>
            Email: guvnorace@gmail.com
            <br />
            Phone: +256 752 462 740
          </p>
        </div>
      </section>
    </PolicyPageLayout>
  );
}
