import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = localFont({
  src: "../fonts/BricolageGrotesque-Variable.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const plexSans = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = localFont({
  src: "../fonts/ibm-plex-mono-latin-500-normal.woff2",
  variable: "--font-plex-mono",
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Regulon · Human risk, measured",
  description:
    "Security awareness told through real stories. Clocked protects you and your family; Regulon measures and improves human risk across your organisation.",
  openGraph: {
    title: "Regulon · Human risk, measured",
    description: "One score. Three scales. Security awareness for families and organisations.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1a22",
  colorScheme: "light",
};

/**
 * Runs before first paint. When motion is allowed it marks the document so
 * hero elements start hidden for the load sequence; reduced-motion visitors
 * never get the class, so nothing is ever hidden for them.
 */
const motionGate = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
