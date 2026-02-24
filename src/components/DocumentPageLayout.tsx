import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type SectionLink = {
  id: string;
  label: string;
};

type DocumentPageLayoutProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedOn: string;
  sections: readonly SectionLink[];
  children: ReactNode;
};

export default function DocumentPageLayout({
  eyebrow,
  title,
  summary,
  updatedOn,
  sections,
  children
}: DocumentPageLayoutProps) {
  return (
    <section className="section document-page">
      <div className="document-shell">
        <aside className="document-aside" aria-label="On this page">
          <div className="document-aside-card">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="document-title">{title}</h1>
            <p className="document-summary">{summary}</p>
            <p className="document-updated">Updated {updatedOn}</p>
          </div>
          <div className="document-aside-card">
            <p className="document-nav-title">On this page</p>
            <nav className="document-nav">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="document-aside-card document-aside-card--subtle">
            <p className="document-nav-title">Need help?</p>
            <p className="document-summary">
              Contact <a href="mailto:sales@macadent.com.my">sales@macadent.com.my</a> for procurement, compliance, or website requests.
            </p>
            <Link className="document-inline-link" to="/contact">
              Go to Contact
            </Link>
          </div>
        </aside>
        <div className="document-content">{children}</div>
      </div>
    </section>
  );
}
