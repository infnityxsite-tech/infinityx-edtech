/**
 * useSEO — Lightweight per-page SEO injection hook
 *
 * Injects <title>, <meta name="description">, <link rel="canonical">,
 * and optionally <meta name="robots"> into the document <head> on mount.
 *
 * Works without react-helmet or any extra dependency — pure DOM mutation.
 * Google's crawler executes JavaScript, so these tags are discoverable.
 *
 * Usage:
 *   useSEO({ title: "...", description: "...", canonical: "https://infx.space/..." })
 */
import { useEffect } from "react";

const BASE_URL = "https://infx.space";
const DEFAULT_TITLE_SUFFIX = " | Infinity X Solutions";

interface SEOOptions {
  /** Page-specific title (suffix is added automatically). */
  title: string;
  /** Page-specific meta description (140–160 chars ideal). */
  description: string;
  /** Full canonical URL including https://infx.space. */
  canonical: string;
  /**
   * robots directive override.
   * Defaults to "index, follow" (indexable).
   * Pass "noindex, follow" for transactional/private pages.
   */
  robots?: string;
}

function getOrCreate(tag: string, attr: string, value: string): HTMLElement {
  const selector = `${tag}[${attr}="${value}"]`;
  let el = document.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  return el;
}

export function useSEO({ title, description, canonical, robots }: SEOOptions) {
  useEffect(() => {
    // 1. <title>
    document.title = title.endsWith(DEFAULT_TITLE_SUFFIX)
      ? title
      : `${title}${DEFAULT_TITLE_SUFFIX}`;

    // 2. <meta name="description">
    const descEl = getOrCreate("meta", "name", "description") as HTMLMetaElement;
    descEl.setAttribute("content", description);

    // 3. <link rel="canonical">
    let canonEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonEl);
    }
    canonEl.setAttribute("href", canonical);

    // 4. <meta name="robots">
    const robotsEl = getOrCreate("meta", "name", "robots") as HTMLMetaElement;
    robotsEl.setAttribute("content", robots ?? "index, follow");

    // 5. og:title / og:description (best-effort)
    const ogTitle = getOrCreate("meta", "property", "og:title") as HTMLMetaElement;
    ogTitle.setAttribute("content", document.title);

    const ogDesc = getOrCreate("meta", "property", "og:description") as HTMLMetaElement;
    ogDesc.setAttribute("content", description);

    const ogUrl = getOrCreate("meta", "property", "og:url") as HTMLMetaElement;
    ogUrl.setAttribute("content", canonical);
  }, [title, description, canonical, robots]);
}

export { BASE_URL };
