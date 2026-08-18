"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  pageGalleryDetails,
  pageGalleryKeys,
  type PageGalleryKey,
  type ResolvedWebsiteImages,
} from "@/lib/cms/websiteImages";

function galleryKeyForPath(pathname: string): PageGalleryKey | null {
  return pageGalleryKeys.find((key) => pageGalleryDetails[key].path === pathname) ?? null;
}

export default function PageGalleryOutlet({
  galleries,
}: {
  galleries: ResolvedWebsiteImages["pageGalleries"];
}) {
  const pathname = usePathname();
  const key = galleryKeyForPath(pathname);
  if (!key) return null;

  const gallery = galleries[key];
  if (!gallery.visible || gallery.images.length === 0) return null;

  const headingId = `page-gallery-${key}`;

  return (
    <section className="section page-section-soft page-photo-gallery" aria-labelledby={headingId}>
      <div className="site-container">
        <div className="page-section-header">
          <div>
            <p className="section-eyebrow">Photo gallery</p>
            <h2 id={headingId}>{gallery.title}</h2>
          </div>
          <p>Consent-cleared photographs from our programmes and community work.</p>
        </div>
        <div className="public-gallery-grid">
          {gallery.images.map((image) => (
            <figure className="public-gallery-item" key={image.mediaPath}>
              <div>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
