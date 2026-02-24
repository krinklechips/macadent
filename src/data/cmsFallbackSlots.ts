import type { CmsSlotPayload } from "../lib/cms/types";

type CmsFallbackMap = Record<string, CmsSlotPayload>;

export const cmsFallbackSlots: CmsFallbackMap = {
  "macadent-home-updates": {
    slot: {
      key: "macadent-home-updates",
      pageKey: "home",
      sectionKey: "updates",
      title: "Clinic updates and supplier notices",
      tabs: ["updates", "notices"]
    },
    itemsByTab: {
      updates: [
        {
          id: "upd-1",
          type: "news",
          title: "Sterilization room refresh planning checklist",
          summary:
            "A practical checklist covering flow zoning, load sizing, and instrument turnaround planning before replacing autoclaves.",
          ctaLabel: "Request planning support",
          ctaUrl: "/contact",
          updatedAt: "2026-02-24T09:00:00Z"
        },
        {
          id: "upd-2",
          type: "feature",
          title: "Imaging room pre-install site readiness review",
          summary:
            "Coordinate room dimensions, access route, utility points, and workflow placement before finalizing equipment delivery dates.",
          ctaLabel: "Book a site review",
          ctaUrl: "/contact",
          updatedAt: "2026-02-19T09:00:00Z"
        }
      ],
      notices: [
        {
          id: "not-1",
          type: "notice",
          title: "Quote lead-time confirmations are finalized after supplier check",
          summary:
            "Availability and lead time vary by brand and import timing. Share your target install date to help us propose equivalent options faster.",
          ctaLabel: "Send enquiry",
          ctaUrl: "/contact",
          updatedAt: "2026-02-18T09:00:00Z"
        }
      ]
    }
  },
  "macadent-home-programs": {
    slot: {
      key: "macadent-home-programs",
      pageKey: "home",
      sectionKey: "programs",
      title: "Featured programs for clinics",
      tabs: ["featured"]
    },
    itemsByTab: {
      featured: [
        {
          id: "prog-1",
          type: "program",
          title: "New clinic setup bundle planning",
          summary:
            "Stage your operatory, sterilization, and imaging investments in phases while preserving upgrade compatibility.",
          ctaLabel: "Discuss project scope",
          ctaUrl: "/contact"
        },
        {
          id: "prog-2",
          type: "program",
          title: "Replacement planning for aging operatories",
          summary:
            "Replace high-impact room components with minimal workflow interruption and standardized controls across operatories.",
          ctaLabel: "Request replacement plan",
          ctaUrl: "/contact"
        },
        {
          id: "prog-3",
          type: "program",
          title: "Consumables replenishment structuring",
          summary:
            "Build recurring category lists by discipline so teams can reorder faster and reduce stock-outs on key clinical items.",
          ctaLabel: "Build consumables list",
          ctaUrl: "/contact"
        }
      ]
    }
  },
  "macadent-products-featured": {
    slot: {
      key: "macadent-products-featured",
      pageKey: "products",
      sectionKey: "featured-programs",
      title: "Procurement programs and highlights",
      tabs: ["programs", "highlights"]
    },
    itemsByTab: {
      programs: [
        {
          id: "pp-1",
          type: "program",
          title: "Category shortlist support",
          summary:
            "Share your clinic type, room count, and budget band. We return a category shortlist with recommended product families to compare.",
          ctaLabel: "Start shortlist",
          ctaUrl: "/contact"
        },
        {
          id: "pp-2",
          type: "program",
          title: "Expansion project equipment sequencing",
          summary:
            "Plan installation sequence across additional rooms to reduce disruption to active patient schedules.",
          ctaLabel: "Plan expansion",
          ctaUrl: "/contact"
        }
      ],
      highlights: [
        {
          id: "ph-1",
          type: "highlight",
          title: "Sterilization + water quality workflow alignment",
          summary:
            "Bundle sterilization and water treatment planning early to reduce downstream compatibility issues and servicing complexity.",
          ctaLabel: "View sterilization systems",
          ctaUrl: "/products/sterilization"
        }
      ]
    }
  }
};

