import type { NextConfig } from "next";

/**
 * Two deploy targets from one codebase:
 *
 * - Default (Vercel, Node host): a normal Next.js app, including the
 *   /api/waitlist route.
 * - DEPLOY_TARGET=pages (GitHub Pages): a fully static export into ./out.
 *   NEXT_PUBLIC_BASE_PATH is set by the Pages workflow ("/Regulon" on
 *   github.io, empty once a custom domain is attached).
 */
const isPages = process.env.DEPLOY_TARGET === "pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Partial prerendering needs a server, so it is off for the static export.
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  ...(isPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
