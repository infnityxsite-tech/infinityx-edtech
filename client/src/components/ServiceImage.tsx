/**
 * ServiceImage — resolves a service hero image with intelligent fallback hierarchy.
 *
 * Priority:
 *   1. service.hero_image_url from the database (if provided and valid)
 *   2. Exact slug match from SLUG_FALLBACK dictionary
 *   3. Keyword match on slug or title (e.g. 'vision', 'inspection', 'automation', 'rag', etc.)
 *   4. Default bundled solution WebP asset (/uploads/hero_cv_industrial.webp)
 *   5. Decorative CSS gradient placeholder
 *
 * Guaranteed to never display a broken-image browser icon.
 */

import { useState } from "react";

/** Known bundled WebP fallbacks keyed by service slug. */
const SLUG_FALLBACK: Record<string, string> = {
  "computer-vision-systems": "/uploads/hero_cv_industrial.webp",
  "computer-vision": "/uploads/hero_cv_industrial.webp",
  "industrial-ai-inspection": "/uploads/hero_industrial_inspect.webp",
  "industrial-ai": "/uploads/hero_industrial_inspect.webp",
  "ai-automation-systems": "/uploads/hero_ai_automation.webp",
  "ai-automation": "/uploads/hero_ai_automation.webp",
  "custom-llm-development": "/uploads/hero_custom_llm.webp",
  "custom-llm": "/uploads/hero_custom_llm.webp",
  "rag-knowledge-systems": "/uploads/hero_rag_knowledge.webp",
  "rag-systems": "/uploads/hero_rag_knowledge.webp",
  "decision-support-systems": "/uploads/hero_decision_support.webp",
  "decision-support": "/uploads/hero_decision_support.webp",
  "data-engineering": "/uploads/hero_data_engineering.webp",
  "intelligent-dashboards": "/uploads/hero_dashboards.webp",
  "analytics-and-bi": "/uploads/hero_analytics_dash.webp",
  "analytics": "/uploads/hero_analytics_dash.webp",
  "predictive-analytics": "/uploads/hero_analytics_dash.webp",
  "enterprise-mlops-data": "/uploads/mlops_dashboard.webp",
  "mlops-platform": "/uploads/mlops_dashboard.webp",
  "cloud-infrastructure": "/uploads/hero_cloud_infra.webp",
  "cloud-native-architecture": "/uploads/hero_cloud_infra.webp",
  "satellite-agri": "/uploads/satellite_agri_grid.webp",
  "space-solutions": "/uploads/satellite_agri_grid.webp",
  "software-architecture": "/uploads/software_architecture_hero.webp",
  "full-stack-solutions": "/uploads/software_architecture_hero.webp",
};

/** Keyword to WebP asset mappings for smart matching. */
const KEYWORD_MAP: Array<{ keywords: string[]; asset: string }> = [
  { keywords: ["vision", "camera", "detect", "yolo", "spatial", "optical"], asset: "/uploads/hero_cv_industrial.webp" },
  { keywords: ["inspect", "defect", "quality", "industrial", "manufacturing"], asset: "/uploads/hero_industrial_inspect.webp" },
  { keywords: ["automation", "agent", "process", "workflow", "bot", "rpa"], asset: "/uploads/hero_ai_automation.webp" },
  { keywords: ["llm", "language", "gpt", "fine-tun", "transformer"], asset: "/uploads/hero_custom_llm.webp" },
  { keywords: ["rag", "knowledge", "vector", "search", "document", "retriev"], asset: "/uploads/hero_rag_knowledge.webp" },
  { keywords: ["decision", "support", "recommend", "optimiz", "forecast"], asset: "/uploads/hero_decision_support.webp" },
  { keywords: ["data", "etl", "pipeline", "lake", "warehouse", "stream"], asset: "/uploads/hero_data_engineering.webp" },
  { keywords: ["dashboard", "bi", "visual", "monitor", "telemetry", "metric"], asset: "/uploads/hero_dashboards.webp" },
  { keywords: ["analytic", "predict", "statistic", "insight", "trend"], asset: "/uploads/hero_analytics_dash.webp" },
  { keywords: ["mlops", "model", "train", "deploy", "sagemaker", "kubeflow"], asset: "/uploads/mlops_dashboard.webp" },
  { keywords: ["cloud", "k8s", "kubernetes", "infra", "serverless", "aws", "docker"], asset: "/uploads/hero_cloud_infra.webp" },
  { keywords: ["satellite", "space", "orbit", "agri", "gis", "earth"], asset: "/uploads/satellite_agri_grid.webp" },
  { keywords: ["software", "arch", "api", "microservice", "backend", "fullstack"], asset: "/uploads/software_architecture_hero.webp" },
];

/** Default fallback asset if nothing else matches. */
const DEFAULT_FALLBACK = "/uploads/hero_cv_industrial.webp";

/** Match keywords against slug or title. */
function matchKeyword(text: string): string | null {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.asset;
    }
  }
  return null;
}

/**
 * Resolve the initial image source in priority order.
 */
function resolveInitialSrc(slug?: string, title?: string, heroUrl?: string | null): string {
  if (heroUrl && heroUrl.trim()) return heroUrl.trim();
  if (slug && SLUG_FALLBACK[slug]) return SLUG_FALLBACK[slug];
  if (slug) {
    const kwMatch = matchKeyword(slug);
    if (kwMatch) return kwMatch;
  }
  if (title) {
    const kwMatch = matchKeyword(title);
    if (kwMatch) return kwMatch;
  }
  return DEFAULT_FALLBACK;
}

interface ServiceImageProps {
  /** Service object from the API (needs slug + optional hero_image_url and title). */
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

export default function ServiceImage({
  service,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
  loading = "lazy",
  fetchPriority = "auto",
}: ServiceImageProps) {
  const initSrc = resolveInitialSrc(service.slug, service.title, service.hero_image_url);
  const [src, setSrc] = useState<string | null>(initSrc);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    // Stage 1: If custom DB URL failed, try slug fallback
    if (service.slug && SLUG_FALLBACK[service.slug] && src !== SLUG_FALLBACK[service.slug]) {
      setSrc(SLUG_FALLBACK[service.slug]);
      return;
    }

    // Stage 2: Try keyword matching
    const kw = matchKeyword(`${service.slug || ""} ${service.title || ""}`);
    if (kw && src !== kw) {
      setSrc(kw);
      return;
    }

    // Stage 3: Try default fallback
    if (src !== DEFAULT_FALLBACK) {
      setSrc(DEFAULT_FALLBACK);
      return;
    }

    // Stage 4: CSS gradient fallback
    setSrc(null);
    setFailed(true);
  };

  const label = alt ?? service.title ?? service.slug;

  if (failed || !src) {
    return (
      <div
        className={className.replace("object-cover", "")}
        aria-label={label}
        style={{
          backgroundColor: "#EAEDEA",
          backgroundImage:
            "linear-gradient(135deg,rgba(82,115,95,.18) 1px,transparent 1px),linear-gradient(45deg,rgba(31,41,37,.08) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
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

export { SLUG_FALLBACK };
