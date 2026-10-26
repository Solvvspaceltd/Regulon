import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/sections/Hero";
import { Intro } from "@/sections/Intro";
import { ThreeScales } from "@/sections/ThreeScales";
import { Products } from "@/sections/Products";
import { Process } from "@/sections/Process";
import { DrillDemo } from "@/sections/DrillDemo";
import { Principles } from "@/sections/Principles";
import { Join } from "@/sections/Join";
import { SiteFooter } from "@/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Intro />
        <ThreeScales />
        <Products />
        <Process />
        <DrillDemo />
        <Principles />
        <Join />
      </main>
      <SiteFooter />
    </>
  );
}
