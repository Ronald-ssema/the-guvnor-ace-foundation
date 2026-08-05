import PolicyPage from "@/components/policies/PolicyPage";

export default function ChildProtectionPage() {
  return (
    <PolicyPage
      eyebrow="Child protection"
      title="Child Protection Policy"
      summary="The rules and responsibilities guiding our direct work, communication, photography and interaction with children."
      lastReviewed="5 August 2026"
      urgentNotice={{
        title: "Report urgent child-protection concerns immediately",
        text: "Where a child may be at immediate risk, contact the appropriate local authority or emergency service without delay.",
      }}
      sections={[
        {
          heading: "Our commitment",
          paragraphs: [
            "Every child has the right to safety, dignity, respect and protection from violence, abuse, neglect and exploitation.",
            "The Guvnor Ace Foundation aims to make decisions based on the best interests of the child.",
          ],
        },
        {
          heading: "Who this policy applies to",
          points: [
            "Trustees and foundation leaders",
            "Employees and volunteers",
            "Contractors and consultants",
            "Partner organisations",
            "Photographers, media workers and visitors",
          ],
        },
        {
          heading: "Safer recruitment and participation",
          points: [
            "Roles involving children should be clearly defined.",
            "References and appropriate background checks should be considered where available and relevant.",
            "Volunteers must receive clear expectations before participating.",
            "People who pose a known or suspected risk must not be placed in direct contact with children.",
          ],
        },
        {
          heading: "Behaviour around children",
          points: [
            "Treat children equally, patiently and respectfully.",
            "Use language and behaviour appropriate to the child’s age and needs.",
            "Avoid unnecessary physical contact.",
            "Do not develop secretive or exploitative relationships.",
            "Never use physical punishment or degrading treatment.",
          ],
        },
        {
          heading: "Images, video and stories",
          points: [
            "Obtain appropriate consent before taking or publishing identifiable images.",
            "Do not publish full names, addresses, schools or details that could expose a child to risk.",
            "Avoid images that portray children as helpless, humiliated or without dignity.",
            "Do not stage suffering or ask children to repeat traumatic experiences for publicity.",
            "Store sensitive photographs and records securely.",
          ],
        },
        {
          heading: "Responding to disclosure",
          points: [
            "Listen without interruption.",
            "Do not promise complete confidentiality.",
            "Reassure the child that speaking was the right thing to do.",
            "Record the facts promptly.",
            "Report the concern through the safeguarding process.",
          ],
        },
        {
          heading: "Online protection",
          points: [
            "Foundation representatives should use approved communication channels.",
            "Private messaging with children should be avoided unless properly authorised and safeguarded.",
            "Online harassment, grooming or exploitation must be reported.",
          ],
        },
      ]}
    />
  );
}
