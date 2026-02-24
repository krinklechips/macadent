import type { CmsSlotFetchOptions, CmsSlotPayload, CmsSlotResult } from "../types";

const cmsBaseUrl = import.meta.env.VITE_CMS_PLATFORM_BASE_URL?.trim() ?? "";
const tenantSlug = import.meta.env.VITE_CMS_TENANT_SLUG?.trim() ?? "";
const tenantId = import.meta.env.VITE_CMS_TENANT_ID?.trim() ?? "";
const cmsToken = import.meta.env.VITE_CMS_API_TOKEN?.trim() ?? "";

class PlatformCmsError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "PlatformCmsError";
  }
}

const buildHeaders = () => ({
  Accept: "application/json",
  ...(cmsToken ? { Authorization: `Bearer ${cmsToken}` } : {})
});

export async function probePlatformCmsApi(signal?: AbortSignal) {
  if (!cmsBaseUrl) return { ok: false, reason: "missing-base-url" } as const;

  try {
    const healthUrl = new URL("/api/health", cmsBaseUrl);
    const res = await fetch(healthUrl.toString(), {
      method: "GET",
      headers: buildHeaders(),
      signal
    });
    if (res.ok) return { ok: true } as const;
    return { ok: false, reason: `http-${res.status}` } as const;
  } catch (error) {
    return { ok: false, reason: "request-failed", error } as const;
  }
}

export async function getSlotFromPlatform(
  slotKey: string,
  options: CmsSlotFetchOptions = {}
): Promise<CmsSlotResult> {
  if (!cmsBaseUrl) {
    throw new PlatformCmsError("VITE_CMS_PLATFORM_BASE_URL is not configured.");
  }
  if (!tenantSlug && !tenantId) {
    throw new PlatformCmsError("VITE_CMS_TENANT_SLUG or VITE_CMS_TENANT_ID must be configured.");
  }

  const url = new URL(`/api/public/slots/${encodeURIComponent(slotKey)}`, cmsBaseUrl);
  if (tenantSlug) url.searchParams.set("tenantSlug", tenantSlug);
  if (!tenantSlug && tenantId) url.searchParams.set("tenantId", tenantId);

  const res = await fetch(url.toString(), {
    headers: buildHeaders(),
    signal: options.signal
  });

  if (!res.ok) {
    throw new PlatformCmsError(`Platform CMS slot request failed (${res.status}) for ${slotKey}`);
  }

  const payload = (await res.json()) as CmsSlotPayload;
  return {
    ...payload,
    source: "platform"
  };
}

