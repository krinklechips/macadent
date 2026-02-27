import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CmsSlotSection from "../components/CmsSlotSection";
import { useCmsSlot } from "../hooks/useCmsSlot";
import { usePageSeo } from "../hooks/usePageSeo";
import { ProcessSection } from "./Process";

type PublicArticle = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishAt: string | null;
  updatedAt: string;
};

type PublicArticlesResponse = {
  items?: PublicArticle[];
};

type SiteSectionConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type PublicSiteSectionsResponse = {
  siteSections?: {
    homeInsights?: Partial<SiteSectionConfig>;
  };
};

const CMS_PUBLIC_BASE_URL = import.meta.env.VITE_CMS_PLATFORM_BASE_URL?.trim() || "https://cms.macadent.com.my";
const CMS_TENANT_SLUG = import.meta.env.VITE_CMS_TENANT_SLUG?.trim() || "macadent";
const DEFAULT_HOME_INSIGHTS_SECTION: SiteSectionConfig = {
  enabled: true,
  eyebrow: "Insights",
  title: "Latest updates from your CMS-powered editorial feed.",
  subtitle: "This section reads published articles from the tenant CMS. Keep layout stable in code while letting content stay dynamic."
};

export default function Home() {
  usePageSeo({
    title: "Macadent | Dental Equipment, Sterilization & Imaging Solutions",
    description:
      "Macadent Sdn Bhd supplies dental chairs, imaging systems, sterilization equipment, water filtration, and consumables support for clinics in Malaysia.",
    path: "/"
  });

  const homeUpdatesSlot = useCmsSlot("macadent-home-updates");
  const homeProgramsSlot = useCmsSlot("macadent-home-programs");
  const [publicArticles, setPublicArticles] = useState<PublicArticle[]>([]);
  const [articlesReady, setArticlesReady] = useState(false);
  const [homeInsightsSection, setHomeInsightsSection] = useState<SiteSectionConfig>(DEFAULT_HOME_INSIGHTS_SECTION);

  const coreClinicalSystems = [
    {
      title: "Treatment Rooms & Operatories",
      brand: "Chair + Delivery Platforms",
      description:
        "Operatories planned for ergonomic workflows, utility coordination, and long-term serviceability."
    },
    {
      title: "Imaging & Diagnostics",
      brand: "2D / 3D Imaging",
      description:
        "Imaging systems and room-ready planning support aligned to diagnostics, communication, and treatment planning needs."
    },
    {
      title: "Sterilization & Reprocessing",
      brand: "Autoclaves + Workflow",
      description:
        "Instrument reprocessing solutions designed for consistent turnover, compliance workflows, and clinic throughput."
    },
    {
      title: "Consumables & Support Systems",
      brand: "Recurring Supply Planning",
      description:
        "Category-led supply and accessory support that helps clinics standardize replenishment and daily chairside operations."
    }
  ];

  const partnerSignals = [
    {
      label: "Preferred Platform Brands",
      value: "Leading equipment and sterilization partners"
    },
    {
      label: "Project Coverage",
      value: "Consultation, specification, installation, aftercare support"
    },
    {
      label: "Focus",
      value: "Reliable workflows, upgrade readiness, and clinical usability"
    }
  ];

  useEffect(() => {
    let cancelled = false;
    const url = new URL("/api/public/articles", CMS_PUBLIC_BASE_URL);
    url.searchParams.set("tenantSlug", CMS_TENANT_SLUG);
    url.searchParams.set("limit", "8");

    fetch(url.toString(), { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`articles-request-failed-${response.status}`);
        const payload = (await response.json()) as PublicArticlesResponse;
        return Array.isArray(payload.items) ? payload.items : [];
      })
      .then((items) => {
        if (cancelled) return;
        setPublicArticles(items);
      })
      .catch(() => {
        if (cancelled) return;
        setPublicArticles([]);
      })
      .finally(() => {
        if (!cancelled) setArticlesReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const url = new URL("/api/public/site-sections", CMS_PUBLIC_BASE_URL);
    url.searchParams.set("tenantSlug", CMS_TENANT_SLUG);

    fetch(url.toString(), { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`site-sections-request-failed-${response.status}`);
        const payload = (await response.json()) as PublicSiteSectionsResponse;
        const input = payload?.siteSections?.homeInsights || {};
        return {
          enabled: input.enabled !== false,
          eyebrow: String(input.eyebrow || "").trim() || DEFAULT_HOME_INSIGHTS_SECTION.eyebrow,
          title: String(input.title || "").trim() || DEFAULT_HOME_INSIGHTS_SECTION.title,
          subtitle: String(input.subtitle || "").trim() || DEFAULT_HOME_INSIGHTS_SECTION.subtitle
        } satisfies SiteSectionConfig;
      })
      .then((next) => {
        if (cancelled) return;
        setHomeInsightsSection(next);
      })
      .catch(() => {
        if (cancelled) return;
        setHomeInsightsSection(DEFAULT_HOME_INSIGHTS_SECTION);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const insightsArticles = useMemo(() => {
    const insights = publicArticles.filter((item) => String(item.category || "").toLowerCase() === "insights");
    return insights.length ? insights.slice(0, 3) : publicArticles.slice(0, 3);
  }, [publicArticles]);

  const hasInsights = insightsArticles.length > 0;

  function formatArticleDate(value: string | null | undefined) {
    if (!value) return "Not scheduled";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  return (
    <>
      <section className="hero-shell">
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="hero-inner">
          <div className="hero">
            <div className="hero-content">
              <p className="eyebrow">Macadent Sdn Bhd</p>
              <h1>Clinical equipment and consumables support for modern dental practices.</h1>
              <p className="hero-body">
                Build or upgrade operatories, imaging, sterilization, and recurring supply systems
                with category-led procurement support and project-ready planning.
              </p>
              <div className="hero-actions">
                <Link className="button primary" to="/contact">
                  Request a Quote
                </Link>
                <Link className="button ghost" to="/products">
                  View Products
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <p className="eyebrow">Procurement Snapshot</p>
              <h3>Category-first planning for installation and recurring supply continuity.</h3>
              <p className="hero-card-body">
                From operatory upgrades to sterilization workflows and consumables lists, Macadent
                helps clinics shortlist the right categories before final quotation.
              </p>
              <div className="hero-card-list">
                <span>Chair & unit planning</span>
                <span>Imaging & diagnostics</span>
                <span>Sterilization + consumables</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-core-section">
        <div className="section-heading">
          <p className="eyebrow">Core Clinical Systems</p>
          <h2>Four foundational systems for modern, high-performing practices.</h2>
          <p className="section-subtitle">
            Macadent supports equipment planning and recurring supply categories for clinics
            balancing upgrades, throughput, and service continuity.
          </p>
        </div>
        <div className="core-systems-grid">
          {coreClinicalSystems.map((system) => (
            <article key={system.title} className="core-system-card">
              <p className="core-system-brand">{system.brand}</p>
              <h3>{system.title}</h3>
              <p>{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      {homeInsightsSection.enabled ? <section id="insights" className="section home-insights-section">
        <div className="section-heading">
          <p className="eyebrow">{homeInsightsSection.eyebrow}</p>
          <h2>{homeInsightsSection.title}</h2>
          <p className="section-subtitle">{homeInsightsSection.subtitle}</p>
        </div>
        <div className="insights-grid">
          {hasInsights ? (
            insightsArticles.map((item) => (
              <article key={item.id} className="insights-card">
                <p className="insights-meta">{(item.category || "article").toUpperCase()}</p>
                <h3>{item.title}</h3>
                <p>{item.summary || "No summary yet. Add a summary in tenant CMS to improve scannability."}</p>
                <div className="insights-foot">
                  <span>Published {formatArticleDate(item.publishAt || item.updatedAt)}</span>
                  <span className="mono">/{item.slug}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="insights-empty" role="status" aria-live="polite">
              {articlesReady
                ? "No published articles yet. Create and publish an article in tenant CMS to populate this section."
                : "Loading published articles..."}
            </div>
          )}
        </div>
      </section> : null}

      <CmsSlotSection
        data={homeUpdatesSlot.data}
        className="home-cms-slot"
        eyebrow="CMS-Ready Slot"
        fallbackTitle="Clinic updates and planning notices"
        subtitle="This section reads from your CMS platform public slot endpoint when configured, and falls back to local content during setup."
      />

      <ProcessSection
        eyebrow="Process"
        title="From enquiry and planning to installation and aftercare."
        subtitle="A structured engagement flow for new clinics, expansions, equipment replacement, and category-based replenishment planning."
        className="section-block section-alt process-carousel-section home-process-section"
      />

      <CmsSlotSection
        data={homeProgramsSlot.data}
        className="home-cms-slot"
        eyebrow="Featured Programs"
        fallbackTitle="Macadent project and supply support"
        subtitle="Use this slot for promotions, project highlights, supplier notices, or campaign content from your CMS platform."
      />

      <section className="section home-credibility-section">
        <div className="partner-strip">
          {partnerSignals.map((signal) => (
            <article key={signal.label} className="partner-pill">
              <p className="partner-pill-label">{signal.label}</p>
              <p className="partner-pill-value">{signal.value}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
