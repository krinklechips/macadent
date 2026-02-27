import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { companyIdentity } from "../data/siteContent";

type CmsSiteNavLink = {
  id?: string;
  label: string;
  href: string;
  visible?: boolean;
  order?: number;
  description?: string | null;
};

type CmsSiteNavColumn = {
  id?: string;
  title?: string;
  visible?: boolean;
  order?: number;
  items?: CmsSiteNavLink[];
};

type CmsSiteNavItem = CmsSiteNavLink & {
  type?: "link" | "mega";
  columns?: CmsSiteNavColumn[];
};

type CmsSiteNavigation = {
  version?: number;
  primary?: CmsSiteNavItem[];
  cta?: CmsSiteNavLink | null;
};

type CmsSiteNavigationResponse = {
  siteNavigation?: CmsSiteNavigation;
};

type CmsSiteSectionsResponse = {
  siteSections?: {
    homeInsights?: {
      enabled?: boolean;
    };
  };
};

const MACADENT_TENANT_SLUG = "macadent";
const CMS_PUBLIC_BASE_URL = "https://cms.macadent.com.my";

const fallbackHeaderNavigation: CmsSiteNavigation = {
  version: 1,
  primary: [
    {
      id: "products",
      label: "Products & Solutions",
      href: "/products",
      type: "mega",
      visible: true,
      order: 0,
      columns: [
        {
          id: "equipment",
          title: "Equipment",
          order: 0,
          visible: true,
          items: [
            { id: "chairs", label: "Dental Chairs & Units", href: "/products/chairs-units", order: 0, visible: true },
            { id: "imaging", label: "Imaging Systems", href: "/products/imaging", order: 1, visible: true },
            { id: "ster", label: "Sterilization Systems", href: "/products/sterilization", order: 2, visible: true },
            { id: "water", label: "Water Filtration", href: "/products/water-filtration", order: 3, visible: true },
            { id: "handpieces", label: "Handpieces & Small Equipment", href: "/products/handpieces-small-equipment", order: 4, visible: true }
          ]
        },
        {
          id: "euronda",
          title: "Euronda Line",
          order: 1,
          visible: true,
          items: [
            { id: "e8", label: "E8 Autoclave", href: "/products/sterilization", order: 0, visible: true },
            { id: "aquafilter", label: "Aquafilter 1 to 1", href: "/products/sterilization", order: 1, visible: true },
            { id: "thermo", label: "Thermodisinfectors", href: "/products/sterilization", order: 2, visible: true }
          ]
        },
        {
          id: "services",
          title: "Services",
          order: 2,
          visible: true,
          items: [
            { id: "clinic-planning", label: "Clinic Planning", href: "/process", order: 0, visible: true },
            { id: "install", label: "Installation & Training", href: "/process", order: 1, visible: true },
            { id: "aftercare", label: "Aftercare Support", href: "/process", order: 2, visible: true },
            { id: "quote", label: "Request a Quote", href: "/contact", order: 3, visible: true }
          ]
        }
      ]
    },
    { id: "process", label: "Process", href: "/process", type: "link", visible: true, order: 1 },
    {
      id: "company",
      label: "Company",
      href: "/company",
      type: "mega",
      visible: true,
      order: 2,
      columns: [
        {
          id: "company-about",
          title: "About",
          order: 0,
          visible: true,
          items: [
            { id: "company-main", label: "Macadent Sdn Bhd", href: "/company", order: 0, visible: true },
            { id: "company-reg", label: "Business Registration", href: "/company", order: 1, visible: true },
            { id: "company-why", label: "Why Macadent", href: "/company", order: 2, visible: true }
          ]
        },
        {
          id: "company-contact",
          title: "Contact",
          order: 1,
          visible: true,
          items: [
            { id: "contact-sales", label: "Contact Sales", href: "/contact", order: 0, visible: true },
            { id: "contact-office", label: "Office Location", href: "/contact", order: 1, visible: true },
            { id: "contact-partners", label: "Preferred Partners", href: "/contact", order: 2, visible: true }
          ]
        }
      ]
    }
  ],
  cta: { id: "contact", label: "Contact", href: "/contact", visible: true }
};

function isExternalHref(href: string) {
  return /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function normalizeNavHref(href: string) {
  const raw = String(href || "").trim();
  if (!raw) return raw;
  if (raw === "/insights") return "/#insights";
  return raw;
}

function navItemKey(item: { label?: string; href?: string }) {
  const label = String(item.label || "").trim().toLowerCase();
  const href = normalizeNavHref(String(item.href || "")).trim().toLowerCase();
  return `${label}::${href}`;
}

function ensureInsightsInNavigation(navigation: CmsSiteNavigation, enabled: boolean) {
  if (!enabled) return navigation;
  const primary = Array.isArray(navigation.primary) ? [...navigation.primary] : [];
  const hasInsights = primary.some((item) => {
    const href = normalizeNavHref(String(item.href || "")).trim().toLowerCase();
    const label = String(item.label || "").trim().toLowerCase();
    return label === "insights" || href === "/#insights" || href.endsWith("#insights");
  });
  if (hasInsights) return navigation;
  const nextOrder = primary.reduce((max, item) => {
    const order = Number(item.order);
    return Number.isFinite(order) ? Math.max(max, order) : max;
  }, -1) + 1;
  primary.push({
    id: "insights-fallback-link",
    label: "Insights",
    href: "/#insights",
    visible: true,
    order: nextOrder,
    type: "link",
    columns: []
  });
  return { ...navigation, primary };
}

function mergeFallbackWithCmsNavigation(fallback: CmsSiteNavigation, cms: CmsSiteNavigation) {
  const fallbackPrimary = Array.isArray(fallback.primary) ? [...fallback.primary] : [];
  const cmsPrimary = Array.isArray(cms.primary) ? [...cms.primary] : [];

  if (!cmsPrimary.length) return fallback;
  if (cmsPrimary.length >= 3) {
    return {
      ...cms,
      cta: cms.cta && cms.cta.visible !== false ? cms.cta : fallback.cta || null
    };
  }

  const merged = [...fallbackPrimary];
  cmsPrimary.forEach((item) => {
    const key = navItemKey(item);
    const existingIndex = merged.findIndex((entry) => navItemKey(entry) === key);
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...item,
        href: normalizeNavHref(String(item.href || merged[existingIndex].href || ""))
      };
      return;
    }
    merged.push({
      ...item,
      href: normalizeNavHref(String(item.href || "")),
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : merged.length
    });
  });

  return {
    version: Number(cms.version || fallback.version || 1),
    primary: merged
      .filter((item) => item.visible !== false && String(item.label || "").trim())
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || a.label.localeCompare(b.label)),
    cta: cms.cta && cms.cta.visible !== false ? cms.cta : fallback.cta || null
  };
}

function normalizeCmsSiteNavigation(input: unknown): CmsSiteNavigation {
  const source = (input && typeof input === "object" ? input : {}) as CmsSiteNavigation;
  const primary = Array.isArray(source.primary) ? source.primary : [];
  return {
    version: Number(source.version || 1) || 1,
    primary: primary
      .map((item, index) => {
        const label = String(item?.label || "").trim();
        if (!label) return null;
        const columns = Array.isArray(item?.columns) ? item.columns : [];
        return {
          id: String(item?.id || `cms-top-${index}`),
          label,
          href: normalizeNavHref(String(item?.href || "").trim()),
          visible: item?.visible !== false,
          order: Number.isFinite(Number(item?.order)) ? Number(item?.order) : index,
          type: columns.length ? "mega" : (item?.type === "mega" ? "mega" : "link"),
          columns: columns
            .map((column, colIndex) => {
              const items = Array.isArray(column?.items) ? column.items : [];
              return {
                id: String(column?.id || `cms-col-${index}-${colIndex}`),
                title: String(column?.title || "").trim(),
                visible: column?.visible !== false,
                order: Number.isFinite(Number(column?.order)) ? Number(column?.order) : colIndex,
                items: items
                  .map((subItem, itemIndex) => ({
                    id: String(subItem?.id || `cms-sub-${index}-${colIndex}-${itemIndex}`),
                    label: String(subItem?.label || "").trim(),
                    href: normalizeNavHref(String(subItem?.href || "").trim()),
                    visible: subItem?.visible !== false,
                    order: Number.isFinite(Number(subItem?.order)) ? Number(subItem?.order) : itemIndex,
                    description: subItem?.description ? String(subItem.description) : null
                  }))
                  .filter((subItem) => subItem.visible !== false && subItem.label)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label))
              };
            })
            .filter((column) => column.visible !== false && (column.title || column.items.length))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.title || "").localeCompare(b.title || ""))
        } as CmsSiteNavItem;
      })
      .filter((item): item is CmsSiteNavItem => Boolean(item && item.visible !== false))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label)),
    cta:
      source.cta && typeof source.cta === "object" && String(source.cta.label || "").trim() && source.cta.visible !== false
        ? {
            id: String(source.cta.id || "cta"),
            label: String(source.cta.label || "").trim(),
            href: normalizeNavHref(String(source.cta.href || "").trim()),
            visible: true
          }
        : null
  };
}

export default function SiteLayout() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [headerNavigation, setHeaderNavigation] = useState<CmsSiteNavigation>(() => normalizeCmsSiteNavigation(fallbackHeaderNavigation));
  const [newsletterForm, setNewsletterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "Malaysia"
  });
  const footerColumns = [
    {
      title: "Products & Solutions",
      groups: [
        {
          label: "Equipment",
          links: [
            { to: "/products/chairs-units", label: "Dental Chairs & Units" },
            { to: "/products/imaging", label: "Imaging Systems" },
            { to: "/products/sterilization", label: "Sterilization Systems" },
            { to: "/products/water-filtration", label: "Water Filtration" },
            { to: "/products/handpieces-small-equipment", label: "Handpieces & Small Equipment" }
          ]
        },
        {
          label: "Materials",
          links: [
            { to: "/products/materials-consumables", label: "Dental Materials & Consumables" },
            { to: "/products/orthodontic-consumables", label: "Orthodontic Consumables" },
            { to: "/products/materials-consumables", label: "Infection Control Consumables" }
          ]
        }
      ]
    },
    {
      title: "Planning & Support",
      groups: [
        {
          label: "Workflow",
          links: [
            { to: "/process", label: "Consultation Process" },
            { to: "/process", label: "Installation & Training" },
            { to: "/process", label: "Aftercare Support" },
            { to: "/layout-studio", label: "Layout Studio" }
          ]
        },
        {
          label: "Contact",
          links: [
            { to: "/contact", label: "Request a Quote" },
            { to: "/contact", label: "Schedule a Visit" }
          ]
        }
      ]
    },
    {
      title: "Company",
      groups: [
        {
          label: "About",
          links: [
            { to: "/company", label: "Macadent Sdn Bhd" },
            { to: "/company", label: "Business Registration" },
            { to: "/company", label: "Licensing & Compliance" }
          ]
        },
        {
          label: "Catalogues",
          links: [
            { to: "/products", label: "Product Categories" },
            { to: "/products/materials-consumables", label: "Materials & Consumables" }
          ]
        }
      ]
    }
  ] as const;

  useEffect(() => {
    let cancelled = false;
    const fallback = normalizeCmsSiteNavigation(fallbackHeaderNavigation);

    const navUrl = `${CMS_PUBLIC_BASE_URL}/api/public/site-navigation?tenantSlug=${encodeURIComponent(MACADENT_TENANT_SLUG)}`;
    const sectionsUrl = `${CMS_PUBLIC_BASE_URL}/api/public/site-sections?tenantSlug=${encodeURIComponent(MACADENT_TENANT_SLUG)}`;

    Promise.all([
      fetch(navUrl).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Navigation request failed (${response.status})`);
        }
        const data = (await response.json()) as CmsSiteNavigationResponse;
        return normalizeCmsSiteNavigation(data?.siteNavigation);
      }),
      fetch(sectionsUrl)
        .then(async (response) => {
          if (!response.ok) return false;
          const payload = (await response.json()) as CmsSiteSectionsResponse;
          return payload?.siteSections?.homeInsights?.enabled !== false;
        })
        .catch(() => false)
    ])
      .then(([cmsNavigation, insightsEnabled]) => {
        if (cancelled) return;
        const merged = mergeFallbackWithCmsNavigation(fallback, cmsNavigation);
        setHeaderNavigation(ensureInsightsInNavigation(merged, Boolean(insightsEnabled)));
      })
      .catch((error) => {
        if (cancelled) return;
        // Keep resilience fallback, but emit a debug line so integration issues are visible.
        console.warn("[macadent] header navigation fallback active:", error);
        setHeaderNavigation(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const dismissed = window.sessionStorage.getItem("macadent-newsletter-dismissed");
    if (dismissed === "1") {
      return;
    }

    const timer = window.setTimeout(() => {
      setNewsletterOpen(true);
    }, 1400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!newsletterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNewsletterOpen(false);
        window.sessionStorage.setItem("macadent-newsletter-dismissed", "1");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [newsletterOpen]);

  const closeNewsletter = () => {
    setNewsletterOpen(false);
    window.sessionStorage.setItem("macadent-newsletter-dismissed", "1");
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSubmitted(true);
    window.sessionStorage.setItem("macadent-newsletter-dismissed", "1");
  };

  return (
    <div className="page">
      <div className="bg-grid" aria-hidden="true" />

      {newsletterOpen && (
        <div
          className="newsletter-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeNewsletter();
            }
          }}
        >
          <section
            className="newsletter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-title"
            aria-describedby="newsletter-modal-description"
          >
            <button
              type="button"
              className="newsletter-modal-close"
              aria-label="Close newsletter signup"
              onClick={closeNewsletter}
            >
              ×
            </button>

            {!newsletterSubmitted ? (
              <>
                <div className="newsletter-modal-head">
                  <p className="newsletter-modal-kicker">Macadent Clinical Updates</p>
                  <h2 id="newsletter-modal-title">
                    Design, technology and practical upgrades for modern clinics.
                  </h2>
                  <p id="newsletter-modal-description">
                    Subscribe for product updates, sterilization workflow tips, and selected
                    equipment planning insights from Macadent.
                  </p>
                </div>

                <form className="newsletter-modal-form" onSubmit={handleNewsletterSubmit}>
                  <div className="newsletter-modal-grid">
                    <label className="newsletter-field">
                      <span>First Name</span>
                      <input
                        type="text"
                        value={newsletterForm.firstName}
                        onChange={(event) =>
                          setNewsletterForm((prev) => ({
                            ...prev,
                            firstName: event.target.value
                          }))
                        }
                        required
                        autoComplete="given-name"
                        placeholder="Sales"
                      />
                    </label>

                    <label className="newsletter-field">
                      <span>Last Name</span>
                      <input
                        type="text"
                        value={newsletterForm.lastName}
                        onChange={(event) =>
                          setNewsletterForm((prev) => ({
                            ...prev,
                            lastName: event.target.value
                          }))
                        }
                        required
                        autoComplete="family-name"
                        placeholder="Tan"
                      />
                    </label>
                  </div>

                  <label className="newsletter-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={newsletterForm.email}
                      onChange={(event) =>
                        setNewsletterForm((prev) => ({
                          ...prev,
                          email: event.target.value
                        }))
                      }
                      required
                      autoComplete="email"
                      placeholder="you@clinic.com"
                    />
                  </label>

                  <label className="newsletter-field">
                    <span>Country</span>
                    <select
                      value={newsletterForm.country}
                      onChange={(event) =>
                        setNewsletterForm((prev) => ({
                          ...prev,
                          country: event.target.value
                        }))
                      }
                    >
                      <option>Malaysia</option>
                      <option>Singapore</option>
                      <option>Indonesia</option>
                      <option>Thailand</option>
                      <option>Brunei</option>
                      <option>Philippines</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <div className="newsletter-modal-actions">
                    <button type="submit" className="button newsletter-submit-button">
                      Sign up for newsletter
                    </button>
                    <button
                      type="button"
                      className="newsletter-secondary-link"
                      onClick={closeNewsletter}
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="newsletter-modal-success">
                <p className="newsletter-modal-kicker">Subscription Received</p>
                <h2 id="newsletter-modal-title">Thanks for subscribing.</h2>
                <p id="newsletter-modal-description">
                  This popup is now ready for CRM integration. Next step is connecting the submit
                  action to your newsletter platform (Mailchimp, Brevo, HubSpot, etc.).
                </p>
                <div className="newsletter-modal-actions">
                  <button type="button" className="button newsletter-submit-button" onClick={closeNewsletter}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <header className="site-header">
        <Link className="brand" to="/">
          <img
            className="brand-logo brand-logo--lockup"
            src="/mcd-v2-transparent.png"
            alt="Macadent Sdn Bhd Dental and Medical Supplies"
          />
        </Link>
        <nav className="nav-links">
          {(headerNavigation.primary || []).map((item) => {
            const columns = Array.isArray(item.columns) ? item.columns.filter((col) => col.visible !== false) : [];
            const hasMega = item.type === "mega" && columns.length > 0;
            const href = item.href || "/";
            const isExternal = isExternalHref(href);

            if (hasMega) {
              return (
                <div key={item.id || item.label} className="nav-item has-mega">
                  {isExternal ? (
                    <a className="nav-trigger" href={href} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <NavLink className={({ isActive }) => `nav-trigger${isActive ? " active" : ""}`} to={href}>
                      {item.label}
                    </NavLink>
                  )}
                  <div className={`mega-menu${columns.length <= 2 ? " mega-menu--compact" : ""}`}>
                    {columns.map((column) => (
                      <div key={column.id || column.title} className="mega-col">
                        {column.title ? <p className="mega-label">{column.title}</p> : null}
                        {(column.items || []).filter((subItem) => subItem.visible !== false).map((subItem) => {
                          const subHref = subItem.href || href || "/";
                          if (isExternalHref(subHref)) {
                            return (
                              <a key={subItem.id || `${column.id}-${subItem.label}`} href={subHref} target="_blank" rel="noopener noreferrer">
                                {subItem.label}
                              </a>
                            );
                          }
                          return (
                            <Link key={subItem.id || `${column.id}-${subItem.label}`} to={subHref}>
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id || item.label} className="nav-item">
                {isExternal ? (
                  <a className="nav-link" href={href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to={href}>
                    {item.label}
                  </NavLink>
                )}
              </div>
            );
          })}
          <div className="nav-item">
            <NavLink
              className={({ isActive }) => `nav-link nav-link--feature${isActive ? " active" : ""}`}
              to="/layout-studio"
            >
              <span className="nav-feature-dot" aria-hidden="true" />
              <span>Layout Studio</span>
              <span className="nav-feature-badge">Interactive</span>
            </NavLink>
          </div>
          {(() => {
            const cta = headerNavigation.cta && headerNavigation.cta.visible !== false
              ? headerNavigation.cta
              : { label: "Contact", href: "/contact" };
            const ctaHref = cta.href || "/contact";
            if (isExternalHref(ctaHref)) {
              return (
                <a className="nav-cta" href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {cta.label}
                </a>
              );
            }
            return (
              <NavLink className={({ isActive }) => `nav-cta${isActive ? " active" : ""}`} to={ctaHref}>
                {cta.label}
              </NavLink>
            );
          })()}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-sitemap">
          <div className="footer-brand-column">
            <Link className="footer-brand-link" to="/company">
              <img
                className="footer-brand-logo footer-brand-logo--lockup"
                src="/mcd-v2-transparent.png"
                alt="Macadent Sdn Bhd Dental and Medical Supplies"
              />
            </Link>
            <p className="footer-meta">{companyIdentity.legalName}</p>
            <p className="footer-meta">Business Reg: {companyIdentity.businessRegistration}</p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <p className="footer-column-title">{column.title}</p>
              <div className="footer-column-groups">
                {column.groups.map((group) => (
                  <div key={`${column.title}-${group.label}`} className="footer-group">
                    <p className="footer-label">{group.label}</p>
                    <div className="footer-link-list">
                      {group.links.map((link) => (
                        <Link key={`${column.title}-${group.label}-${link.label}`} to={link.to}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="footer-column footer-contact-column">
            <p className="footer-column-title">Contact</p>
            <div className="footer-column-groups">
              <div className="footer-group">
                <p className="footer-label">Direct</p>
                <div className="footer-contact-stack">
                  <a className="footer-link" href="mailto:sales@macadent.com.my">
                    sales@macadent.com.my
                  </a>
                  <a className="footer-link" href="tel:+601131313160">
                    Sales +60 11-3131 3160
                  </a>
                </div>
              </div>
              <div className="footer-group">
                <p className="footer-label">Office</p>
                <p className="footer-address">
                  D-GF-05, Ground Floor, Skypark @ One City, Jalan USJ 25/1, 47650 Subang Jaya,
                  Selangor, Malaysia
                </p>
              </div>
            </div>
          </div>

        </div>
        <div className="footer-bottom">
          <p className="footer-legal">
            © {currentYear} {companyIdentity.legalName}. All rights reserved.
          </p>
          <div className="footer-legal-links" aria-label="Footer legal links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/governance">Governance</Link>
            <Link to="/sitemap">Site Map</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
