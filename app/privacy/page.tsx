import PolicyPage from "@/components/policies/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy Policy"
      summary="How The Guvnor Ace Foundation may collect, use, store and protect personal information."
      lastReviewed="5 August 2026"
      sections={[
        {
          heading: "Information we may collect",
          points: [
            "Names and contact information",
            "Volunteer and partnership enquiry details",
            "Messages submitted through contact forms or email",
            "Donation information supplied by payment platforms",
            "Website usage and technical information",
            "Photographs, videos or stories supplied with appropriate permission",
          ],
        },
        {
          heading: "How we may use information",
          points: [
            "Responding to enquiries",
            "Managing donations, volunteering and partnerships",
            "Communicating programme updates",
            "Maintaining safeguarding and organisational records",
            "Improving our website and services",
            "Meeting legal, regulatory or security responsibilities",
          ],
        },
        {
          heading: "AI assistant",
          paragraphs: [
            "Messages submitted to the website AI assistant may be processed by an external AI service to generate a response.",
            "Visitors should not submit passwords, PINs, payment-card details, medical records or highly sensitive personal information through the assistant.",
          ],
        },
        {
          heading: "Sharing information",
          paragraphs: [
            "Information may be shared with trusted service providers where reasonably necessary to deliver website, communication, payment or organisational services.",
            "We do not intend to sell personal information.",
          ],
        },
        {
          heading: "Retention and security",
          paragraphs: [
            "We aim to keep information only for as long as reasonably necessary and to use proportionate safeguards against unauthorised access, loss or misuse.",
          ],
        },
        {
          heading: "Your choices and rights",
          points: [
            "Ask what personal information we hold about you.",
            "Request correction of inaccurate information.",
            "Ask us to delete information where appropriate.",
            "Withdraw consent where processing is based on consent.",
            "Object to certain uses of your information.",
            "Raise a concern about how your information is handled.",
          ],
        },
        {
          heading: "Cookies and analytics",
          paragraphs: [
            "The website may use essential cookies and, where introduced, analytics tools. A separate cookie notice should explain any non-essential tracking before it is activated.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Privacy enquiries may be sent to guvnorace@gmail.com.",
          ],
        },
      ]}
    />
  );
}
