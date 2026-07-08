/**
 * Unified Device ID Utility
 * 
 * Single source of truth for generating and retrieving
 * the persistent device identifier used for device-limit enforcement.
 * 
 * The ID is a UUID stored in localStorage. It persists across
 * sessions but is lost if localStorage is cleared, the browser
 * is reinstalled, or the user opens incognito mode.
 */

const DEVICE_ID_KEY = "deviceId";

/**
 * Get the current device ID, or create one if it doesn't exist.
 * Always returns a consistent ID for the same browser profile.
 */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Get a short device name from the user agent string.
 * Used for admin display purposes only.
 */
export function getDeviceName(): string {
  return navigator.userAgent.substring(0, 80);
}
