import { Link } from "react-router-dom";
import CmsSlotSection from "../components/CmsSlotSection";
import { useCmsSlot } from "../hooks/useCmsSlot";
import { usePageSeo } from "../hooks/usePageSeo";
import { ProcessSection } from "./Process";

export default function Home() {
  usePageSeo({
    title: "Macadent | Dental Equipment, Sterilization & Imaging Solutions",
    description:
      "Macadent Sdn Bhd supplies dental chairs, imaging systems, sterilization equipment, water filtration, and consumables support for clinics in Malaysia.",
    path: "/"
  });

  const homeUpdatesSlot = useCmsSlot("macadent-home-updates");
  const homeProgramsSlot = useCmsSlot("macadent-home-programs");

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
