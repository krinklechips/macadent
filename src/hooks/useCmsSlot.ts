import { useEffect, useState } from "react";
import { getCmsSlot } from "../lib/cms/client";
import type { CmsSlotResult } from "../lib/cms/types";

type UseCmsSlotState = {
  data: CmsSlotResult | null;
  isLoading: boolean;
  error: string | null;
};

export function useCmsSlot(slotKey: string) {
  const [state, setState] = useState<UseCmsSlotState>({
    data: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((previous) => ({
      ...previous,
      isLoading: true,
      error: null
    }));

    getCmsSlot(slotKey, { signal: controller.signal })
      .then((data) => {
        setState({
          data,
          isLoading: false,
          error: null
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load content slot"
        });
      });

    return () => controller.abort();
  }, [slotKey]);

  return state;
}

