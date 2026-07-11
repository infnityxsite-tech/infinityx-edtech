/**
 * useSEO — Lightweight per-page SEO injection hook
 *
 * Injects <title>, <meta name="description">, <link rel="canonical">,
 * and <meta name="robots"> into the document <head> on mount and whenever
 * values change.
 *
 * CRITICAL LIFECYCLE RULES:
 * - NEVER inject noindex during a loading state. Pass robots=undefined while
 *   loading so the hook defers writing the robots tag until data is resolved.
 * - A cleanup function resets the robots tag to "index, follow" between SPA
 *   navigations to prevent stale noindex from a previous page persisting on
 *   the next page before its useEffect fires.
 */
import { useEffect } from "react";

const BASE_URL = "https://infx.space";
const DEFAULT_TITLE_SUFFIX = " | Infinity X Solutions";

export interface SEOOptions {
  /** Page-specific title. Suffix is appended automatically. */
  title: string;
  /** Page-specific meta description (140–160 chars ideal). */
  description: string;
  /** Full canonical URL including https://infx.space. */
  canonical: string;
  /**
   * robots directive.
   * - Pass undefined (or omit) while async data is still LOADING.
   *   The hook will NOT write the robots tag until a definitive value is known.
   * - "index, follow"  → public, indexable page (post/solution/school exists)
   * - "noindex, follow" → private/transactional page, or confirmed not-found
   */
  robots?: string;
}

function getOrCreate<T extends HTMLElement>(
  tag: string,
  attr: string,
  value: string
): T {
  const selector = `${tag}[${attr}="${value}"]`;
  let el = document.querySelector<T>(selector);
  if (!el) {
    el = document.createElement(tag) as T;
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  return el;
}

export function useSEO({ title, description, canonical, robots }: SEOOptions) {
  useEffect(() => {
    // 1. <title>
    const fullTitle = title.endsWith(DEFAULT_TITLE_SUFFIX)
      ? title
      : `${title}${DEFAULT_TITLE_SUFFIX}`;
    document.title = fullTitle;

    // 2. <meta name="description">
    const descEl = getOrCreate<HTMLMetaElement>("meta", "name", "description");
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
    // IMPORTANT: Only write the robots tag when we have a definitive value.
    // While robots is undefined (loading state), do NOT touch the tag.
    // This prevents the initial undefined-post state from injecting noindex
    // before the async fetch resolves.
    if (robots !== undefined) {
      const robotsEl = getOrCreate<HTMLMetaElement>("meta", "name", "robots");
      robotsEl.setAttribute("content", robots);
    }

    // 5. og:title / og:description / og:url (best-effort)
    const ogTitle = getOrCreate<HTMLMetaElement>("meta", "property", "og:title");
    ogTitle.setAttribute("content", fullTitle);

    const ogDesc = getOrCreate<HTMLMetaElement>("meta", "property", "og:description");
    ogDesc.setAttribute("content", description);

    const ogUrl = getOrCreate<HTMLMetaElement>("meta", "property", "og:url");
    ogUrl.setAttribute("content", canonical);
  }, [title, description, canonical, robots]);

  // Cleanup: when navigating away via SPA, reset robots to "index, follow"
  // so the NEXT page doesn't start with a stale noindex from this page.
  useEffect(() => {
    return () => {
      const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (robotsEl) {
        robotsEl.setAttribute("content", "index, follow");
      }
    };
  }, []);
}

export { BASE_URL };
