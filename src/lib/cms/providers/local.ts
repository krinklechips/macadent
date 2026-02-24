import { cmsFallbackSlots } from "../../../data/cmsFallbackSlots";
import type { CmsSlotResult } from "../types";

export async function getSlotFromLocal(slotKey: string): Promise<CmsSlotResult> {
  const payload = cmsFallbackSlots[slotKey];
  if (!payload) {
    return {
      slot: {
        key: slotKey,
        title: "Content slot",
        tabs: ["default"]
      },
      itemsByTab: {
        default: []
      },
      source: "local"
    };
  }

  return {
    ...payload,
    source: "local"
  };
}

