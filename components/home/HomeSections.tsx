import Image from "next/image";
import Link from "next/link";

const programmes = [
  {
    image: "/images/food-drive.jpg",
    title: "Food and Nutrition",
    description:
      "Providing meals and essential food supplies to vulnerable children and families.",
  },
  {
    image: "/images/education.jpg",
    title: "Education Support",
    description:
      "Helping children access learning materials, school support and brighter opportunities.",
  },
  {
    image: "/images/about.jpg",
    title: "Community Outreach",
    description:
      "Working directly with local communities to identify needs and deliver practical support.",
  },
];

const stories = [
  {
    image: "/images/child-1.jpg",
    title: "A child supported with essential supplies",
    description:
      "Practical help can restore dignity, confidence and hope for a child and their family.",
  },
  {
    image: "/images/child-2.jpg",
    title: "Building brighter futures together",
    description:
      "Every act of generosity helps children move towards safety, education and opportunity.",
  },
];

export default function HomeSections() {
  return (
    <>
      <section className="section" id="about">
        <div className="site-container about-grid">
          <div className="section-image">
            <Image
              src="/images/about.jpg"
              alt="The Guvnor Ace Foundation community outreach"
              fill
              className="content-image"
              sizes="(max-width: 920px) 100vw, 48vw"
            />
          </div>

          <div>
            <p className="eyebrow">About our foundation</p>
            <h2>Local action. Lasting impact.</h2>

            <p className="about-copy">
              Based in Wakiso District, Uganda, The Guvnor Ace Foundation works
              alongside vulnerable children, families and communities. Our
              programmes focus on food security, education, healthcare, child
              protection and sustainable opportunity.
            </p>

            <Link href="/about" className="secondary-button">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="section soft-section" id="work">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What we do</p>
              <h2>Practical programmes that meet real needs.</h2>
            </div>

            <p>
              Our work is designed around the needs of children and communities,
              with dignity, safeguarding and accountability at the centre.
            </p>
          </div>

          <div className="programme-grid">
            {programmes.map((programme) => (
              <article className="programme-card image-card" key={programme.title}>
                <div className="card-image">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    className="content-image"
                    sizes="(max-width: 920px) 100vw, 33vw"
                  />
                </div>

                <div className="card-content">
                  <h3>{programme.title}</h3>
                  <p>{programme.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section" id="stories">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Stories of hope</p>
              <h2>Every child deserves to be seen and supported.</h2>
            </div>

            <p>
              These stories represent the children, families and communities
              whose lives can change through compassionate action.
            </p>
          </div>

          <div className="story-grid">
            {stories.map((story) => (
              <article className="story-card" key={story.title}>
                <div className="story-image">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="content-image"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>

                <div className="story-content">
                  <span>Community story</span>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section donation-section">
        <div className="site-container donation-grid">
          <div>
            <p className="eyebrow">Support our mission</p>
            <h2>Your generosity can create lasting change.</h2>
            <p className="about-copy">
              Donations help provide food, education, healthcare, protection
              and practical support to vulnerable children in Uganda.
            </p>
          </div>

          <div className="donation-card">
            <h3>Help us reach more children.</h3>
            <p>
              Donate securely through our official GoFundMe campaign or view
              all available support options.
            </p>

            <div className="hero-actions">
              <a
                href="https://gofund.me/07e5b2cbf"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
              >
                Donate on GoFundMe
              </a>

              <a
                href="https://linktr.ee/guvnoracefoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button"
              >
                Other Ways to Help
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
