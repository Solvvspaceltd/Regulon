import { Backdrop } from "@/components/Backdrop";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Story } from "@/sections/Story";
import { Assessment } from "@/sections/Assessment";
import { Platform } from "@/sections/Platform";
import { Products } from "@/sections/Products";
import { Plans } from "@/sections/Plans";
import { Principles } from "@/sections/Principles";
import { Join } from "@/sections/Join";
import { SiteFooter } from "@/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <Backdrop />
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <Story />
        <Assessment />
        <Platform />
        <Products />
        <Plans />
        <Principles />
        <Join />
      </main>
      <SiteFooter />
    </>
  );
}
