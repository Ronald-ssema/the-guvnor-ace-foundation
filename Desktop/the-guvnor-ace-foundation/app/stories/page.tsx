import Image from "next/image";

const stories = [
  {
    image: "/images/child-1.jpg",
    title: "Support that restores hope",
    text:
      "Practical assistance can help a vulnerable child regain dignity, confidence and a stronger sense of possibility.",
  },
  {
    image: "/images/child-2.jpg",
    title: "Children at the centre of our mission",
    text:
      "Our work begins by listening to children and families and responding with compassion, safeguarding and respect.",
  },
  {
    image: "/images/food-drive.jpg",
    title: "Sharing food with vulnerable communities",
    text:
      "Food support can provide immediate relief while helping families and communities move towards greater stability.",
  },
  {
    image: "/images/education.jpg",
    title: "Education creates opportunity",
    text:
      "Learning support gives children the tools, confidence and encouragement they need to build brighter futures.",
  },
];

export default function StoriesPage() {
  return (
    <main>
      <section className="page-header">
        <div className="site-container page-header-content">
          <p className="eyebrow">Stories of hope</p>
          <h1>Real people. Real needs. Meaningful support.</h1>
          <p>
            We share stories carefully and respectfully, protecting the dignity
            and privacy of the children and families involved.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container story-grid">
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
                <span>Foundation story</span>
                <h2>{story.title}</h2>
                <p>{story.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
