import Image from "next/image";
import type { ResolvedWebsiteImage } from "@/lib/cms/websiteImages";


export default function HomeSections({ image }: { image: ResolvedWebsiteImage }) {
  return (
    <section className="about-section section" aria-labelledby="about-heading">
      <div className={`site-container about-grid ${image.visible ? "" : "about-grid-without-image"}`}>
        {image.visible && (
        <div className="about-image-card">
          <Image
            src={image.src}
            alt={image.alt}
            width={900}
            height={1100}
            className="about-image"
            unoptimized={image.src.startsWith("http")}
          />

          <div className="about-image-badge">
            <strong>Community-led support</strong>
            <span>Delivered with dignity and care</span>
          </div>
        </div>
        )}

        <div className="about-content">
          <p className="section-eyebrow">About our foundation</p>

          <h2 id="about-heading" className="section-heading">
            Local action. Lasting impact.
          </h2>

          <p className="section-description">
            The Guvnor Ace Foundation works alongside vulnerable children,
            families and communities in Uganda.
          </p>

          <p className="about-copy">
            Our programmes focus on food support, education, child protection,
            healthcare and practical opportunities that help people build safer
            and more stable futures.
          </p>

          <div className="about-highlights">
            <div>
              <strong>Based in Uganda</strong>
              <span>Working directly with local communities</span>
            </div>

            <div>
              <strong>Safeguarding focused</strong>
              <span>Protecting dignity, privacy and wellbeing</span>
            </div>
          </div>

          <a href="/about" className="secondary-button">
            Learn More About Us
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
