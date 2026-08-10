"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationLinks = [
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/programmes" },
  { label: "Impact", href: "/impact" },
  { label: "Reports", href: "/reports" },
  { label: "Get Involved", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}
    >
      <div className="navbar container">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <Image
            src="/images/logo.png"
            alt="The Guvnor Ace Foundation"
            width={58}
            height={58}
            priority
          />

          <span className="navbar-brand-text">
            <strong>The Guvnor Ace</strong>
            <span>Foundation</span>
          </span>
        </Link>

        <button
          type="button"
          className={`mobile-menu-button ${
            menuOpen ? "mobile-menu-button-open" : ""
          }`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`navbar-navigation ${
            menuOpen ? "navbar-navigation-open" : ""
          }`}
          aria-label="Primary navigation"
        >
          <div className="navbar-links">
            {navigationLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "navbar-link navbar-link-active"
                      : "navbar-link"
                  }
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/donate"
            className="navbar-donate-button"
            onClick={closeMenu}
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
