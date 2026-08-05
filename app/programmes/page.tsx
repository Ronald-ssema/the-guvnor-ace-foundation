import Image from "next/image";
import Link from "next/link";

const programmes = [
  {
    title: "Food and Nutrition",
    image: "/images/food-drive.jpg",
    description:
      "We provide meals and essential food support to vulnerable children and families facing food insecurity.",
    activities: [
      "Community food distributions",
      "Emergency household food assistance",
      "Nutrition awareness and referrals",
      "Support for children at risk of hunger",
    ],
  },
  {
    title: "Education Support",
    image: "/images/education.jpg",
    description:
      "We help children access learning opportunities, school materials and practical educational support.",
    activities: [
      "School materials and learning supplies",
      "Education access support",
      "Mentoring and encouragement",
      "Community learning activities",
    ],
  },
  {
    title: "Child Protection",
    image: "/images/child-1.jpg",
    description:
      "We promote the safety, dignity and wellbeing of children through safeguarding-focused community support.",
    activities: [
      "Safeguarding awareness",
      "Referral to appropriate services",
      "Family and community engagement",
      "Confidential and respectful support",
    ],
  },
  {
    title: "Community Development",
    image: "/images/about.jpg",
    description:
      "We work alongside local communities to identify needs and develop practical, sustainable responses.",
    activities: [
      "Community consultations",
      "Support for vulnerable families",
      "Volunteer mobilisation",
      "Partnerships with local organisations",
    ],
  },
];

export default function ProgrammesPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Our work</p>
          <h1>Practical programmes designed around community needs.</h1>
          <p>
            Our programmes focus on food security, education, child protection
            and community development for vulnerable children and families in
            Uganda.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container detailed-programme-grid">
          {programmes.map((programme) => (
            <article className="detailed-programme-card" key={programme.title}>
              <div className="detailed-programme-image">
                <Image
                  src={programme.image}
                  alt={programme.title}
                  fill
                  className="content-image"
                  sizes="(max-width: 920px) 100vw, 50vw"
                />
              </div>

              <div className="detailed-programme-content">
                <h2>{programme.title}</h2>
                <p>{programme.description}</p>

                <h3>Key activities</h3>
                <ul>
                  {programme.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section donation-section">
        <div className="site-container donation-grid">
          <div>
            <p className="eyebrow">Support our programmes</p>
            <h2>Help us reach more children and families.</h2>
          </div>

          <div className="hero-actions">
            <Link href="/donate" className="primary-button">
              Donate Today
            </Link>

            <Link href="/get-involved" className="secondary-button">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
