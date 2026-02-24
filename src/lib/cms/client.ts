import * as localProvider from "./providers/local";
import * as platformProvider from "./providers/platform";
import type { CmsMode, CmsSlotFetchOptions, CmsSlotResult } from "./types";

const configuredMode = (import.meta.env.VITE_CMS_MODE?.toLowerCase() ?? "auto") as CmsMode;
let probeCache: Awaited<ReturnType<typeof platformProvider.probePlatformCmsApi>> | null = null;

async function canUsePlatform() {
  if (configuredMode === "platform") return true;
  if (configuredMode === "local") return false;
  if (!probeCache) probeCache = await platformProvider.probePlatformCmsApi();
  return Boolean(probeCache.ok);
}

async function withFallback<T>(label: string, primary: () => Promise<T>, fallback: () => Promise<T>) {
  const usePlatform = await canUsePlatform();
  if (!usePlatform) return fallback();

  try {
    return await primary();
  } catch (error) {
    console.warn(`[cms] Platform mode failed for ${label}; falling back to local content.`, error);
    return fallback();
  }
}

export async function getCmsSlot(
  slotKey: string,
  options: CmsSlotFetchOptions = {}
): Promise<CmsSlotResult> {
  return withFallback(
    `slot:${slotKey}`,
    () => platformProvider.getSlotFromPlatform(slotKey, options),
    () => localProvider.getSlotFromLocal(slotKey)
  );
}

