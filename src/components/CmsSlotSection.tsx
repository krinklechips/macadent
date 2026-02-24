import { useEffect, useMemo, useState } from "react";
import type { CmsSlotResult } from "../lib/cms/types";

type CmsSlotSectionProps = {
  data: CmsSlotResult | null;
  className?: string;
  eyebrow?: string;
  fallbackTitle?: string;
  subtitle?: string;
};

function formatTabLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CmsSlotSection({
  data,
  className = "",
  eyebrow = "CMS Content",
  fallbackTitle = "Featured content",
  subtitle
}: CmsSlotSectionProps) {
  const tabs = data?.slot.tabs ?? [];
  const [activeTab, setActiveTab] = useState<string>(tabs[0] ?? "default");

  useEffect(() => {
    if (tabs.length && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [activeTab, tabs]);

  const safeActiveTab = useMemo(() => {
    if (!tabs.length) return "default";
    return tabs.includes(activeTab) ? activeTab : tabs[0];
  }, [activeTab, tabs]);

  const items = data?.itemsByTab?.[safeActiveTab] ?? [];
  const title = data?.slot.title || fallbackTitle;
  const sourceLabel = data?.source === "platform" ? "CMS Live" : "Local Fallback";

  if (!data) return null;

  return (
    <section className={`section cms-slot-section ${className}`.trim()}>
      <div className="cms-slot-shell">
        <div className="cms-slot-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h3>{title}</h3>
            {subtitle ? <p className="cms-slot-subtitle">{subtitle}</p> : null}
          </div>
          <span className={`cms-slot-source-badge ${data.source}`}>{sourceLabel}</span>
        </div>

        {tabs.length > 1 ? (
          <div className="cms-slot-tabs" role="tablist" aria-label={`${title} tabs`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={safeActiveTab === tab}
                className={`cms-slot-tab ${safeActiveTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {formatTabLabel(tab)}
              </button>
            ))}
          </div>
        ) : null}

        {items.length ? (
          <div className="cms-slot-grid">
            {items.map((item) => (
              <article key={`${safeActiveTab}-${item.id}`} className="cms-slot-card">
                <div className="cms-slot-card-meta">
                  <span>{formatTabLabel(item.type || safeActiveTab)}</span>
                  {item.updatedAt ? <time>{new Date(item.updatedAt).toLocaleDateString()}</time> : null}
                </div>
                <h4>{item.title}</h4>
                {item.summary ? <p>{item.summary}</p> : null}
                {item.ctaUrl ? (
                  <a href={item.ctaUrl} className="cms-slot-card-link">
                    {item.ctaLabel || "Learn more"} →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="cms-slot-empty">
            <p>No published items are assigned to this slot yet.</p>
            <p>
              Use your CMS platform to publish content items and assign them to
              <code>{` ${data.slot.key} `}</code>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

