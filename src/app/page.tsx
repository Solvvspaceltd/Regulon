import { Backdrop } from "@/components/Backdrop";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Story } from "@/sections/Story";
import { Assessment } from "@/sections/Assessment";
import { Products } from "@/sections/Products";
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
        <Products />
        <Principles />
        <Join />
      </main>
      <SiteFooter />
    </>
  );
}
