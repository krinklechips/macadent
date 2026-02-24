import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { companyIdentity } from "../data/siteContent";

export default function SiteLayout() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
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
                        placeholder="Carey"
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
          <div className="nav-item has-mega">
            <NavLink className={({ isActive }) => `nav-trigger${isActive ? " active" : ""}`} to="/products">
              Products &amp; Solutions
            </NavLink>
            <div className="mega-menu">
              <div className="mega-col">
                <p className="mega-label">Equipment</p>
                <Link to="/products/chairs-units">Dental Chairs &amp; Units</Link>
                <Link to="/products/imaging">Imaging Systems</Link>
                <Link to="/products/sterilization">Sterilization Systems</Link>
                <Link to="/products/water-filtration">Water Filtration</Link>
                <Link to="/products/handpieces-small-equipment">Handpieces &amp; Small Equipment</Link>
                <p className="mega-label">Materials</p>
                <Link to="/products/materials-consumables">Dental Materials &amp; Consumables</Link>
                <Link to="/products/orthodontic-consumables">Orthodontic Consumables</Link>
              </div>
              <div className="mega-col">
                <p className="mega-label">Euronda Line</p>
                <Link to="/products/sterilization">E8 Autoclave</Link>
                <Link to="/products/sterilization">Aquafilter 1 to 1</Link>
                <Link to="/products/sterilization">Thermodisinfectors</Link>
              </div>
              <div className="mega-col">
                <p className="mega-label">Services</p>
                <Link to="/process">Clinic Planning</Link>
                <Link to="/process">Installation &amp; Training</Link>
                <Link to="/process">Aftercare Support</Link>
                <Link to="/contact">Request a Quote</Link>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/process">
              Process
            </NavLink>
          </div>
          <div className="nav-item has-mega">
            <NavLink className={({ isActive }) => `nav-trigger${isActive ? " active" : ""}`} to="/company">
              Company
            </NavLink>
            <div className="mega-menu mega-menu--compact">
              <div className="mega-col">
                <p className="mega-label">About</p>
                <Link to="/company">Macadent Sdn Bhd</Link>
                <Link to="/company">Business Registration</Link>
                <Link to="/company">Why Macadent</Link>
              </div>
              <div className="mega-col">
                <p className="mega-label">Contact</p>
                <Link to="/contact">Contact Carey</Link>
                <Link to="/contact">Office Location</Link>
                <Link to="/contact">Preferred Partners</Link>
              </div>
              <div className="mega-col">
                <p className="mega-label">Resources</p>
                <Link to="/products">Product Catalogue</Link>
                <Link to="/process">Consultation Process</Link>
                <Link to="/contact">Schedule a Visit</Link>
              </div>
            </div>
          </div>
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
          <NavLink className={({ isActive }) => `nav-cta${isActive ? " active" : ""}`} to="/contact">
            Contact
          </NavLink>
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
              <div>
                <p className="footer-brand-name">{companyIdentity.tradeName}</p>
                <p className="footer-brand-tagline">{companyIdentity.subtitle}</p>
              </div>
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
                  <a className="footer-link" href="tel:+60169090913">
                    Carey +60 16-909 0913
                  </a>
                </div>
              </div>
              <div className="footer-group">
                <p className="footer-label">Office</p>
                <p className="footer-address">
                  I-05-5, Setiawalk, Block I, Persiaran Wawasan, Bandar Pusat Puchong,
                  47160 Puchong, Selangor D.E., Malaysia
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
