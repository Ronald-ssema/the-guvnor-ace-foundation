import PolicyPage from "@/components/policies/PolicyPage";

export default function ComplaintsPage() {
  return (
    <PolicyPage
      eyebrow="Accountability"
      title="Complaints Policy"
      summary="How supporters, beneficiaries, partners and members of the public can raise a concern about our conduct or services."
      lastReviewed="5 August 2026"
      urgentNotice={{
        title: "Safeguarding complaints",
        text: "A complaint involving immediate danger, abuse or exploitation should be treated as a safeguarding concern and referred urgently to appropriate authorities.",
      }}
      sections={[
        {
          heading: "Our commitment",
          paragraphs: [
            "The Guvnor Ace Foundation aims to receive complaints respectfully, review them fairly and use appropriate feedback to improve its work.",
            "Raising a genuine complaint should not result in unfair treatment.",
          ],
        },
        {
          heading: "What you may complain about",
          points: [
            "The conduct of a staff member, volunteer or representative",
            "The quality or safety of a programme or activity",
            "Misleading information or fundraising communication",
            "Failure to respond appropriately to an enquiry",
            "Privacy or data-handling concerns",
            "Discrimination, harassment or inappropriate behaviour",
          ],
        },
        {
          heading: "How to complain",
          paragraphs: [
            "Send your complaint to guvnorace@gmail.com or contact +256 752 462 740.",
            "Include your name and contact information, what happened, when and where it happened, who was involved, and what outcome you are seeking.",
            "Anonymous complaints may be considered, although limited information can make investigation more difficult.",
          ],
        },
        {
          heading: "How we aim to respond",
          points: [
            "Acknowledge the complaint where contact information is available.",
            "Assess whether urgent safety or safeguarding action is required.",
            "Assign the matter to an appropriate person who is not directly involved where reasonably possible.",
            "Review available evidence fairly.",
            "Provide an outcome or progress update within a reasonable period.",
          ],
        },
        {
          heading: "Confidentiality",
          paragraphs: [
            "Complaint information should be shared only with people who reasonably need it to review the matter, protect people or meet legal responsibilities.",
          ],
        },
        {
          heading: "Appeal or further review",
          paragraphs: [
            "If you believe a complaint was not handled fairly, you may request a further internal review and explain the reasons.",
            "Serious matters may also be raised with an appropriate regulator, law-enforcement body, child-protection authority or payment provider.",
          ],
        },
        {
          heading: "Learning from complaints",
          paragraphs: [
            "The foundation aims to record significant complaints, identify recurring issues and make reasonable improvements where needed.",
          ],
        },
      ]}
    />
  );
}
