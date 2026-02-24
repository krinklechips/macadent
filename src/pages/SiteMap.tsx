import { Link } from "react-router-dom";
import DocumentPageLayout from "../components/DocumentPageLayout";

const sections = [
  { id: "main-pages", label: "Main Pages" },
  { id: "catalogues", label: "Catalogues" },
  { id: "planning", label: "Planning & Tools" },
  { id: "legal-pages", label: "Legal & Governance" }
] as const;

const groups = [
  {
    id: "main-pages",
    title: "Main Pages",
    links: [
      { to: "/", label: "Home" },
      { to: "/company", label: "Company" },
      { to: "/contact", label: "Contact" }
    ]
  },
  {
    id: "catalogues",
    title: "Catalogues",
    links: [
      { to: "/products", label: "Products (Category Landing)" },
      { to: "/products/chairs-units", label: "Dental Chairs & Units" },
      { to: "/products/imaging", label: "Imaging Systems" },
      { to: "/products/sterilization", label: "Sterilization Systems" },
      { to: "/products/water-filtration", label: "Water Filtration" },
      { to: "/products/handpieces-small-equipment", label: "Handpieces & Small Equipment" },
      { to: "/products/materials-consumables", label: "Dental Materials & Consumables" },
      { to: "/products/orthodontic-consumables", label: "Orthodontic Consumables" }
    ]
  },
  {
    id: "planning",
    title: "Planning & Tools",
    links: [
      { to: "/process", label: "Process" },
      { to: "/layout-studio", label: "Layout Studio" },
      { to: "/drafts", label: "Interactive Drafts" }
    ]
  },
  {
    id: "legal-pages",
    title: "Legal & Governance",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Use" },
      { to: "/governance", label: "Governance & Compliance" },
      { to: "/sitemap", label: "Site Map" }
    ]
  }
] as const;

export default function SiteMapPage() {
  return (
    <DocumentPageLayout
      eyebrow="Navigation"
      title="Site Map"
      summary="A structured list of pages and key sections available on the Macadent website."
      updatedOn="February 23, 2026"
      sections={sections}
    >
      {groups.map((group) => (
        <section id={group.id} key={group.id} className="document-block">
          <h2>{group.title}</h2>
          <div className="document-link-grid">
            {group.links.map((link) => (
              <Link key={`${group.id}-${link.to}-${link.label}`} className="document-link-card" to={link.to}>
                <span>{link.label}</span>
                <span className="document-link-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </DocumentPageLayout>
  );
}
