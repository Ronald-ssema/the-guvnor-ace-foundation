import PolicyPage from "@/components/policies/PolicyPage";

export default function DonationRefundPage() {
  return (
    <PolicyPage
      eyebrow="Donations"
      title="Donation and Refund Policy"
      summary="How donations are received, acknowledged and reviewed when a donor reports a payment problem."
      lastReviewed="5 August 2026"
      sections={[
        {
          heading: "Making a donation",
          paragraphs: [
            "Donations should be made only through payment details and fundraising links published on the foundation’s official website or verified social accounts.",
            "Online donations may also be subject to the terms of the payment platform used.",
          ],
        },
        {
          heading: "Use of donations",
          paragraphs: [
            "Donations are intended to support the foundation’s charitable activities, programme delivery and reasonable operational needs.",
            "Where a campaign is restricted to a particular purpose, the foundation aims to apply funds to that purpose or handle any necessary change responsibly.",
          ],
        },
        {
          heading: "Donation acknowledgements",
          paragraphs: [
            "Where contact information is available, the foundation or payment platform may provide a transaction confirmation or acknowledgement.",
          ],
        },
        {
          heading: "Mistaken or unauthorised donations",
          paragraphs: [
            "A donor who believes a payment was made in error, duplicated or made without authorisation should contact the foundation and the relevant payment provider promptly.",
            "The donor may be asked to provide reasonable transaction information so the payment can be identified.",
          ],
        },
        {
          heading: "Refund requests",
          paragraphs: [
            "Donations are generally treated as voluntary gifts and refunds are not automatic.",
            "A refund request will be considered individually, taking account of the circumstances, the payment provider’s rules, whether funds have already been committed or spent, and applicable legal or governance responsibilities.",
          ],
        },
        {
          heading: "Chargebacks and disputes",
          paragraphs: [
            "Donors should contact the foundation first where possible. Fraudulent chargebacks or knowingly false disputes may be challenged using available transaction evidence.",
          ],
        },
        {
          heading: "Fundraising platforms",
          paragraphs: [
            "GoFundMe and other external platforms may apply their own refund, processing-fee and dispute procedures. Requests involving those platforms may need to be made directly through them.",
          ],
        },
        {
          heading: "Contacting us",
          paragraphs: [
            "Send donation enquiries to guvnorace@gmail.com with the transaction date, amount, payment method and a brief explanation. Do not email full card numbers, PINs or passwords.",
          ],
        },
      ]}
    />
  );
}
