/**
 * LessonEmbed — provider-aware iframe embed helper.
 *
 * Google Drive iframes get a strict sandbox that blocks popup navigation
 * (the Drive "Pop-out" / "Open in Google Drive" button) while still
 * allowing the embedded player to function normally.
 *
 * A thin CSS overlay blocks the top-right corner where Drive renders its
 * external-link control without covering the main playback area.
 *
 * IMPORTANT: restricting the sandbox does NOT make the Google Drive URL
 * secret. A technically advanced user can still find it via DevTools.
 * This change removes the normal user-facing pop-out affordance only.
 */

import { useMemo } from "react";

type Provider = "google-drive" | "generic" | "unsupported";

function detectProvider(url: string): Provider {
  if (!url) return "unsupported";
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) return "google-drive";
  return "generic";
}

/** Convert a raw Drive URL to the /preview embed form. */
function toDrivePreviewUrl(url: string): string {
  return url.replace(/\/view.*$/, "/preview");
}

interface LessonEmbedProps {
  /** Raw lesson URL from the database. */
  url: string;
  /** CSS class applied to the wrapper div. */
  className?: string;
  /** Title for the iframe (accessibility). */
  title?: string;
  /** If true this is a document/material viewer rather than a video player. */
  isMaterial?: boolean;
}

/**
 * Sandboxed iframe wrapper that blocks Google Drive's pop-out control.
 *
 * Sandbox grants for video players:
 *   allow-scripts          – Drive player JS
 *   allow-same-origin      – required for cookies/auth inside the embed
 *   allow-forms            – form submissions inside the embed
 *   allow-presentation     – fullscreen presentation mode
 *
 * Deliberately excluded:
 *   allow-popups                    – blocks window.open()
 *   allow-popups-to-escape-sandbox  – blocks popups bypassing sandbox
 *   allow-top-navigation            – blocks top-level navigation
 *   allow-top-navigation-by-user-activation – blocks user-gesture navigation
 *
 * Sandbox grants for material/document viewers (more permissive for PDFs):
 *   allow-scripts allow-same-origin allow-forms allow-downloads
 */
export default function LessonEmbed({ url, className = "", title = "Lesson", isMaterial = false }: LessonEmbedProps) {
  const provider = useMemo(() => detectProvider(url), [url]);

  if (provider === "unsupported" || !url) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 text-slate-500 text-sm ${className}`}>
        No video available for this lesson.
      </div>
    );
  }

  if (provider === "google-drive") {
    const embedUrl = toDrivePreviewUrl(url);

    // Sandbox: allow minimal required functionality; NO popups or top navigation.
    const sandbox = isMaterial
      ? "allow-scripts allow-same-origin allow-forms allow-downloads"
      : "allow-scripts allow-same-origin allow-forms allow-presentation";

    return (
      // Relative wrapper so the overlay can be absolutely positioned.
      <div className={`relative overflow-hidden ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          sandbox={sandbox}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 block"
          referrerPolicy="no-referrer"
        />
        {/* Thin overlay in the top-right corner that blocks the Drive
            "Pop-out" button without covering any playback controls.
            Drive renders the pop-out button ~48px tall × ~48px wide in
            the top-right corner of the embed. We cover slightly more to
            be safe on different screen sizes. */}
        {!isMaterial && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 56,
              height: 56,
              // Transparent but pointer-events block the underlying button.
              background: "transparent",
              pointerEvents: "all",
              zIndex: 10,
            }}
          />
        )}
      </div>
    );
  }

  // Generic trusted embed (YouTube, Loom, Vimeo, etc.)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src={url}
        title={title}
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0 block"
      />
    </div>
  );
}
