import { createPageMetadata } from "@/lib/seo";

import Image from "next/image";
import { getWebsiteImageSettings, type WebsiteImageSlotKey } from "@/lib/cms/websiteImages";

const stories = [
  {
    imageKey: "childOne" as WebsiteImageSlotKey,
    title: "Support that restores hope",
    text:
      "Practical assistance can help a vulnerable child regain dignity, confidence and a stronger sense of possibility.",
  },
  {
    imageKey: "childTwo" as WebsiteImageSlotKey,
    title: "Children at the centre of our mission",
    text:
      "Our work begins by listening to children and families and responding with compassion, safeguarding and respect.",
  },
  {
    imageKey: "food" as WebsiteImageSlotKey,
    title: "Sharing food with vulnerable communities",
    text:
      "Food support can provide immediate relief while helping families and communities move towards greater stability.",
  },
  {
    imageKey: "education" as WebsiteImageSlotKey,
    title: "Education creates opportunity",
    text:
      "Learning support gives children the tools, confidence and encouragement they need to build brighter futures.",
  },
];

export const metadata = createPageMetadata({
  title: "Stories of Hope",
  description:
    "Read responsible stories about community support, education, food assistance and the work of The Guvnor Ace Foundation in Uganda.",
  path: "/stories",
});

export default async function StoriesPage() {
  const websiteImages = await getWebsiteImageSettings();

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
              {websiteImages.slots[story.imageKey].visible && (
              <div className="story-image">
                <Image
                  src={websiteImages.slots[story.imageKey].src}
                  alt={websiteImages.slots[story.imageKey].alt}
                  fill
                  className="content-image"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  unoptimized={websiteImages.slots[story.imageKey].src.startsWith("http")}
                />
              </div>
              )}

              <div className="story-content">
                <span>Foundation story</span>
                <h2>{story.title}</h2>
                <p>{story.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {websiteImages.gallery.visible && websiteImages.gallery.images.length > 0 && (
        <section className="section page-section-soft" aria-labelledby="public-gallery-heading">
          <div className="site-container">
            <div className="page-section-header">
              <div>
                <p className="section-eyebrow">Photo gallery</p>
                <h2 id="public-gallery-heading">{websiteImages.gallery.title}</h2>
              </div>
              <p>Consent-cleared photographs from our programmes and community work.</p>
            </div>
            <div className="public-gallery-grid">
              {websiteImages.gallery.images.map((image) => (
                <figure className="public-gallery-item" key={image.mediaPath}>
                  <div>
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized />
                  </div>
                  {image.caption && <figcaption>{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
