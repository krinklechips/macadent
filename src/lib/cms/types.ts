export type CmsMode = "auto" | "platform" | "local";

export type CmsSlotItem = {
  id: string | number;
  type: string;
  title: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  updatedAt?: string;
  sortOrder?: number;
};

export type CmsSlotPayload = {
  tenant?: {
    id?: number;
    slug?: string;
    name?: string;
  };
  slot: {
    key: string;
    pageKey?: string;
    sectionKey?: string;
    title?: string;
    tabs: string[];
    config?: Record<string, unknown>;
  };
  itemsByTab: Record<string, CmsSlotItem[]>;
};

export type CmsSlotResult = CmsSlotPayload & {
  source: "platform" | "local";
};

export type CmsSlotFetchOptions = {
  signal?: AbortSignal;
};

