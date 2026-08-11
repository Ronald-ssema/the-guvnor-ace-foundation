import { createPageMetadata } from "@/lib/seo";

import Link from "next/link";

const programmeAreas = [
  {
    number: "01",
    title: "Education",
    description:
      "We support opportunities that help vulnerable children access education, remain engaged in learning and pursue a more promising future.",
  },
  {
    number: "02",
    title: "Food & Essential Support",
    description:
      "We provide practical assistance to individuals and families experiencing hardship, helping them meet essential needs during difficult periods.",
  },
  {
    number: "03",
    title: "Child Protection",
    description:
      "The safety, dignity and wellbeing of children are central to our work. We promote environments where vulnerable children are respected, protected and supported.",
  },
  {
    number: "04",
    title: "Health & Wellbeing",
    description:
      "We recognise that good health is fundamental to a person's ability to learn, work and thrive, and we support initiatives that contribute to healthier and safer lives.",
  },
  {
    number: "05",
    title: "Community Empowerment",
    description:
      "We support opportunities that can help individuals and families strengthen their independence, resilience and ability to build better futures.",
  },
];

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about The Guvnor Ace Foundation, our mission and our work supporting vulnerable children, families and communities in Uganda.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f8fafc]">
        <div
          className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#e8b11f]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1180px] px-6 py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.22em] text-[#cc9400]">
              About The Guvnor Ace Foundation
            </p>

            <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] text-[#06172e] md:text-7xl">
              Every child deserves the opportunity to build a brighter future.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#5f6f86] md:text-xl">
              The Guvnor Ace Foundation is a Uganda-based charitable
              organisation committed to improving the lives of vulnerable
              children, families and communities.
            </p>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f6f86]">
              We believe that a person&apos;s circumstances should never define
              their potential. Every child deserves to feel safe, every family
              deserves to live with dignity, and every community deserves the
              opportunity to build a stronger future.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/donate"
                className="rounded-full bg-[#e8b11f] px-7 py-4 font-bold text-[#06172e] transition hover:-translate-y-0.5 hover:bg-[#cc9400]"
              >
                Donate & Make an Impact
              </Link>

              <Link
                href="/programmes"
                className="rounded-full border border-[#06172e]/20 bg-white px-7 py-4 font-bold text-[#06172e] transition hover:-translate-y-0.5 hover:border-[#06172e]/40"
              >
                See Our Work →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc9400]">
              Who We Are
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#06172e] md:text-5xl">
              Compassion with purpose. Support with lasting impact.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-[#5f6f86]">
            <p>
              The Guvnor Ace Foundation was established with a simple but
              powerful belief: meaningful change begins when we recognise the
              dignity, potential and humanity of every person.
            </p>

            <p>
              We work with vulnerable children, individuals and families facing
              difficult circumstances, providing support where it can make a
              genuine difference.
            </p>

            <p>
              Our approach goes beyond responding to immediate needs. Wherever
              possible, we seek to address the challenges that keep people
              vulnerable and help create opportunities that enable individuals
              and families to move forward with greater confidence and
              independence.
            </p>

            <p className="font-bold text-[#237a55]">
              We listen. We respond. We empower.
            </p>
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="bg-[#06172e] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e8b11f]">
              Why We Exist
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Behind every challenge is a human story.
            </h2>

            <div className="mt-10 grid gap-8 text-lg leading-8 text-white/75 md:grid-cols-2">
              <p>
                Behind every hardship is a person with hopes, abilities and
                dreams for a better tomorrow. A child may need the opportunity
                to remain in education. A family may be struggling to meet
                essential needs.
              </p>

              <p>
                The Guvnor Ace Foundation exists to stand alongside people
                during those difficult moments. We believe support should
                protect dignity, restore hope and, wherever possible, create a
                pathway towards lasting positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc9400]">
              What We Do
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#06172e] md:text-5xl">
              Creating opportunities. Strengthening communities. Changing
              lives.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#5f6f86]">
              Our programmes respond to immediate needs while also looking
              towards the longer-term challenges affecting vulnerable
              communities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programmeAreas.map((programme) => (
              <article
                key={programme.title}
                className="rounded-[24px] border border-[#06172e]/10 bg-white p-8 shadow-[0_14px_40px_rgba(6,23,46,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(6,23,46,0.10)]"
              >
                <p className="text-sm font-bold tracking-[0.18em] text-[#cc9400]">
                  {programme.number}
                </p>

                <h3 className="mt-8 text-2xl font-bold text-[#06172e]">
                  {programme.title}
                </h3>

                <p className="mt-4 leading-7 text-[#5f6f86]">
                  {programme.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc9400]">
              Our Approach
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#06172e] md:text-5xl">
              From immediate support to lasting opportunity.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-[#5f6f86]">
            <p>
              We believe effective charitable work begins with understanding
              the real needs of the people and communities we serve.
            </p>

            <p>
              Our approach is centred on compassion, dignity, accountability
              and sustainable impact. Where urgent assistance is required, we
              aim to respond responsibly. Where longer-term solutions are
              possible, we seek opportunities that can help people become
              stronger and more self-reliant.
            </p>

            <p className="font-semibold text-[#06172e]">
              Our goal is not simply to help people through today — it is to
              contribute towards creating better possibilities for tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* WHERE WE WORK */}
      <section className="bg-[#fff9e8]">
        <div className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc9400]">
                Where We Work
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#06172e] md:text-5xl">
                Rooted in Wakiso. Reaching communities across Uganda.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-[#5f6f86]">
              <p>
                The Guvnor Ace Foundation is based in{" "}
                <strong className="text-[#06172e]">
                  Seguku–Bunamwaya, Wakiso District, Uganda.
                </strong>
              </p>

              <p>
                While Wakiso is our home, our mission is not limited by district
                boundaries.
              </p>

              <p>
                We reach out to vulnerable children, families and communities
                across Uganda, responding to genuine needs wherever our
                resources, capacity and partnerships allow us to make a
                responsible and meaningful contribution.
              </p>

              <p className="font-semibold text-[#237a55]">
                Every community matters. Every life deserves dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
          <div className="rounded-[32px] border border-[#06172e]/10 bg-[#f8fafc] p-8 md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc9400]">
              Transparency & Accountability
            </p>

            <div className="mt-6 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <h2 className="font-serif text-4xl leading-tight text-[#06172e] md:text-5xl">
                Your trust matters to us.
              </h2>

              <div className="space-y-5 text-lg leading-8 text-[#5f6f86]">
                <p>
                  We recognise that every donation represents someone&apos;s
                  decision to believe in our mission and entrust us with
                  resources intended to help others.
                </p>

                <p>
                  The Guvnor Ace Foundation is committed to responsible
                  stewardship, transparency and accountability in the way
                  support is received, managed and directed towards our
                  charitable work.
                </p>

                <p>
                  We are equally committed to safeguarding the dignity and
                  privacy of the people we support. Their personal circumstances
                  and stories are treated with care and respect.
                </p>

                <Link
                  href="/reports"
                  className="inline-flex font-bold text-[#06172e] underline decoration-[#e8b11f] decoration-2 underline-offset-8"
                >
                  Explore our reports and accountability →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#06172e]">
        <div className="mx-auto max-w-[1180px] px-6 py-24 text-center md:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e8b11f]">
            Be Part of the Change
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-tight text-white md:text-6xl">
            Your compassion can become someone&apos;s opportunity.
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/70">
            Lasting change is never created by one organisation alone. Whether
            you donate, volunteer, partner with us or help share our mission,
            you become part of something bigger — creating safer, stronger and
            more hopeful futures across Uganda.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="rounded-full bg-[#e8b11f] px-8 py-4 font-bold text-[#06172e] transition hover:-translate-y-0.5 hover:bg-[#cc9400]"
            >
              Donate & Make an Impact
            </Link>

            <Link
              href="/programmes"
              className="rounded-full border border-white/25 px-8 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:border-white/50"
            >
              See Our Work →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
