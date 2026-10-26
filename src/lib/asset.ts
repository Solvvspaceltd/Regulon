/**
 * Prefix a file in /public with the site's base path.
 * Next.js adds the base path to its own assets, but not to plain <img> or
 * <source> URLs, so anything served from /public goes through this.
 */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
