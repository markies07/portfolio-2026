import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
