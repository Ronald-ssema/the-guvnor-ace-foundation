import Link from "next/link";

type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions = [],
}: PageHeroProps) {
  return (
    <section className="page-hero" aria-labelledby="page-hero-heading">
      <div className="site-container page-hero-inner">
        <p className="page-hero-eyebrow">{eyebrow}</p>

        <h1 id="page-hero-heading">{title}</h1>

        <p className="page-hero-description">{description}</p>

        {actions.length > 0 && (
          <div className="page-hero-actions">
            {actions.map((action) => (
              <Link
                key={`${action.href}-${action.label}`}
                href={action.href}
                className={
                  action.variant === "secondary"
                    ? "secondary-button"
                    : "primary-button"
                }
              >
                {action.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PageHero;
