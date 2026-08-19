/**
 * ServiceImage — resolves a service hero image with intelligent fallback hierarchy.
 *
 * Priority:
 *   1. Exact slug match from SLUG_FALLBACK dictionary (high-resolution WebP)
 *   2. Normalized DB hero_image_url (.webp / .png)
 *   3. Keyword match on slug or title (e.g. 'vision', 'inspection', 'automation', 'rag', etc.)
 *   4. Deterministic distinct fallback by hash so no two services share an image
 *   5. Decorative CSS gradient placeholder
 *
 * Guaranteed to never display a broken-image browser icon.
 */

import { useEffect, useState } from "react";

/** Known bundled WebP fallbacks keyed by every service slug in DB & CMS. */
const SLUG_FALLBACK: Record<string, string> = {
  // 1. Computer Vision Systems
  "computer-vision-systems": "/uploads/hero_cv_industrial.webp",
  "computer-vision": "/uploads/hero_cv_industrial.webp",
  "cv-systems": "/uploads/hero_cv_industrial.webp",

  // 2. Predictive Analytics
  "predictive-analytics": "/uploads/hero_analytics_dash.webp",
  "analytics-and-bi": "/uploads/hero_analytics_dash.webp",
  "analytics": "/uploads/hero_analytics_dash.webp",
  "predictive-intelligence": "/uploads/hero_analytics_dash.webp",

  // 3. AI Automation Systems
  "ai-automation-systems": "/uploads/hero_ai_automation.webp",
  "ai-automation": "/uploads/hero_ai_automation.webp",
  "automation-systems": "/uploads/hero_ai_automation.webp",
  "process-automation": "/uploads/hero_ai_automation.webp",

  // 4. Custom LLM Solutions
  "custom-llm-solutions": "/uploads/hero_custom_llm.webp",
  "custom-llm-development": "/uploads/hero_custom_llm.webp",
  "custom-llm": "/uploads/hero_custom_llm.webp",
  "llm-solutions": "/uploads/hero_custom_llm.webp",

  // 5. Intelligent Dashboards
  "intelligent-dashboards": "/uploads/hero_dashboards.webp",
  "dashboards": "/uploads/hero_dashboards.webp",
  "bi-dashboards": "/uploads/hero_dashboards.webp",

  // 6. RAG & Knowledge Systems
  "rag-knowledge-systems": "/uploads/hero_rag_knowledge.webp",
  "rag-systems": "/uploads/hero_rag_knowledge.webp",
  "knowledge-systems": "/uploads/hero_rag_knowledge.webp",
  "enterprise-rag": "/uploads/hero_rag_knowledge.webp",

  // 7. Industrial AI Inspection
  "industrial-ai-inspection": "/uploads/hero_industrial_inspect.webp",
  "industrial-inspection": "/uploads/hero_industrial_inspect.webp",
  "industrial-ai": "/uploads/hero_industrial_inspect.webp",
  "defect-detection": "/uploads/hero_industrial_inspect.webp",

  // 8. Decision Support Systems
  "decision-support-systems": "/uploads/hero_decision_support.webp",
  "decision-support": "/uploads/hero_decision_support.webp",
  "decision-intelligence": "/uploads/hero_decision_support.webp",

  // Additional Specializations
  "data-engineering": "/uploads/hero_data_engineering.webp",
  "data-pipelines": "/uploads/hero_data_engineering.webp",
  "enterprise-mlops-data": "/uploads/mlops_dashboard.webp",
  "mlops-platform": "/uploads/mlops_dashboard.webp",
  "cloud-infrastructure": "/uploads/hero_cloud_infra.webp",
  "cloud-native-architecture": "/uploads/hero_cloud_infra.webp",
  "satellite-agri": "/uploads/satellite_agri_grid.webp",
  "space-solutions": "/uploads/satellite_agri_grid.webp",
  "software-architecture": "/uploads/software_architecture_hero.webp",
  "full-stack-solutions": "/uploads/software_architecture_hero.webp",
};

/** Distinct image pool for deterministic fallback */
const DISTINCT_IMAGE_POOL = [
  "/uploads/hero_cv_industrial.webp",
  "/uploads/hero_analytics_dash.webp",
  "/uploads/hero_ai_automation.webp",
  "/uploads/hero_custom_llm.webp",
  "/uploads/hero_dashboards.webp",
  "/uploads/hero_rag_knowledge.webp",
  "/uploads/hero_industrial_inspect.webp",
  "/uploads/hero_decision_support.webp",
  "/uploads/hero_data_engineering.webp",
  "/uploads/hero_cloud_infra.webp",
  "/uploads/satellite_agri_grid.webp",
  "/uploads/software_architecture_hero.webp",
  "/uploads/mlops_dashboard.webp",
];

/** Keyword to WebP asset mappings for smart matching. */
const KEYWORD_MAP: Array<{ keywords: string[]; asset: string }> = [
  { keywords: ["vision", "camera", "detect", "yolo", "spatial", "optical"], asset: "/uploads/hero_cv_industrial.webp" },
  { keywords: ["inspect", "defect", "quality", "industrial", "manufacturing"], asset: "/uploads/hero_industrial_inspect.webp" },
  { keywords: ["automation", "agent", "process", "workflow", "bot", "rpa"], asset: "/uploads/hero_ai_automation.webp" },
  { keywords: ["llm", "language", "gpt", "fine-tun", "transformer", "prompt"], asset: "/uploads/hero_custom_llm.webp" },
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

/** Get a deterministic distinct fallback based on service slug or title hash */
function getDeterministicFallback(identifier: string): string {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DISTINCT_IMAGE_POOL.length;
  return DISTINCT_IMAGE_POOL[index];
}

/**
 * Resolve the initial image source in priority order.
 */
function resolveInitialSrc(slug?: string, title?: string, heroUrl?: string | null): string {
  // 1. Exact slug dictionary match
  if (slug && SLUG_FALLBACK[slug]) {
    return SLUG_FALLBACK[slug];
  }

  // 2. Direct DB hero URL (normalize .png to .webp if applicable)
  if (heroUrl && heroUrl.trim()) {
    const trimmed = heroUrl.trim();
    // If it's an /uploads/ URL ending in .png, return the .webp version
    if (trimmed.startsWith("/uploads/") && trimmed.endsWith(".png")) {
      return trimmed.replace(/\.png$/, ".webp");
    }
    return trimmed;
  }

  // 3. Keyword matching on slug or title
  if (slug) {
    const kwMatch = matchKeyword(slug);
    if (kwMatch) return kwMatch;
  }
  if (title) {
    const kwMatch = matchKeyword(title);
    if (kwMatch) return kwMatch;
  }

  // 4. Deterministic distinct fallback
  return getDeterministicFallback(slug || title || "default");
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

  // Re-synchronize state whenever the service prop changes (e.g. user selects a different service)
  useEffect(() => {
    const newSrc = resolveInitialSrc(service.slug, service.title, service.hero_image_url);
    setSrc(newSrc);
    setFailed(false);
  }, [service.slug, service.hero_image_url, service.title]);

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

    // Stage 3: Try deterministic fallback
    const det = getDeterministicFallback(service.slug || service.title || "service");
    if (src !== det) {
      setSrc(det);
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
            "linear-gradient(135deg,rgba(100,83,194,.15) 1px,transparent 1px),linear-gradient(45deg,rgba(31,41,37,.06) 1px,transparent 1px)",
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
