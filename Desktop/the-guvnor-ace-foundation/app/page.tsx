import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HomeSections from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <HomeSections />
      </main>
    </>
  );
}