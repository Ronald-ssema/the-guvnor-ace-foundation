import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-container navbar">

        {/* Logo */}
        <Link href="/" className="brand">
          <Image
            src="/images/logo.png"
            alt="The Guvnor Ace Foundation"
            width={60}
            height={60}
            priority
            className="brand-logo"
          />

          <span className="brand-name">
            <strong>The Guvnor Ace</strong>
            <small>Foundation</small>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="desktop-navigation">
          <Link href="/about">About</Link>
          <Link href="/programmes">Our Work</Link>
          <Link href="/impact">Impact</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/get-involved">Get Involved</Link>
          <Link href="/contact">Contact</Link>

          <Link href="/donate" className="donate-button">
            Donate
          </Link>
        </nav>

      </div>
    </header>
  );
}
