export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = "Infinity X Solutions";

// Hardcoded logo path - no need to update via admin panel
export const APP_LOGO = "/uploads/logo.webp";

// Simple login URL for JWT authentication (no OAuth)
export const getLoginUrl = () => {
  return "/admin-login";
};
