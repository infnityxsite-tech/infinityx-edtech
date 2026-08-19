/**
 * ServiceImage — resolves a service hero image with graceful fallback.
 *
 * Priority:
 *   1. service.hero_image_url from the database  (may be a /uploads/* path)
 *   2. bundled fallback by slug (pre-converted WebP assets in /uploads/)
 *   3. Decorative CSS gradient fallback
 *
 * All images use onError to fall through the chain without ever showing
 * a broken-image icon.
 */

import { useState } from "react";

/** Known bundled WebP fallbacks keyed by service slug. */
const SLUG_FALLBACK: Record<string, string> = {
  "computer-vision-systems": "/uploads/hero_cv_industrial.webp",
  "industrial-ai-inspection": "/uploads/hero_industrial_inspect.webp",
  "ai-automation-systems": "/uploads/hero_ai_automation.webp",
  "custom-llm-development": "/uploads/hero_custom_llm.webp",
  "rag-knowledge-systems": "/uploads/hero_rag_knowledge.webp",
  "decision-support-systems": "/uploads/hero_decision_support.webp",
  "data-engineering": "/uploads/hero_data_engineering.webp",
  "intelligent-dashboards": "/uploads/hero_dashboards.webp",
  "analytics-and-bi": "/uploads/hero_analytics_dash.webp",
  "mlops-platform": "/uploads/mlops_dashboard.webp",
  "cloud-infrastructure": "/uploads/hero_cloud_infra.webp",
  "satellite-agri": "/uploads/satellite_agri_grid.webp",
  "software-architecture": "/uploads/software_architecture_hero.webp",
};

interface ServiceImageProps {
  /** Service object from the API (needs slug + optional hero_image_url). */
  service: { slug: string; title?: string; title_ar?: string; hero_image_url?: string | null };
  /** Alt text override. */
  alt?: string;
  /** Additional class names applied to the <img> element. */
  className?: string;
  /** Image loading strategy. */
  loading?: "lazy" | "eager";
  /** fetchPriority forwarded to the img element. */
  fetchPriority?: "auto" | "high" | "low";
}

/**
 * Resolve the initial src in priority order:
 *   1. DB hero_image_url
 *   2. Slug-based bundled fallback
 *   3. null (use CSS fallback)
 */
function resolveInitialSrc(slug: string, heroUrl?: string | null): string | null {
  if (heroUrl && heroUrl.trim()) return heroUrl.trim();
  return SLUG_FALLBACK[slug] ?? null;
}

export default function ServiceImage({
  service,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
  loading = "lazy",
  fetchPriority = "auto",
}: ServiceImageProps) {
  const initSrc = resolveInitialSrc(service.slug, service.hero_image_url);
  const slugFallback = SLUG_FALLBACK[service.slug] ?? null;

  const [src, setSrc] = useState<string | null>(initSrc);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    // If the DB URL failed, try the slug fallback (unless we're already on it).
    if (src && src !== slugFallback && slugFallback) {
      setSrc(slugFallback);
    } else {
      // Both the DB URL and the slug fallback failed — show CSS gradient.
      setSrc(null);
      setFailed(true);
    }
  };

  const label = alt ?? service.title ?? service.slug;

  if (failed || !src) {
    // Decorative gradient placeholder — matches the existing Solutions design.
    return (
      <div
        className={className.replace("object-cover", "")}
        aria-label={label}
        style={{
          backgroundImage:
            "linear-gradient(135deg,rgba(18,104,229,.2) 1px,transparent 1px),linear-gradient(45deg,rgba(16,32,51,.15) 1px,transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={label}
      className={className}
      onError={handleError}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  );
}

/** Export the slug map so pages can reference it without duplicating it. */
export { SLUG_FALLBACK };
