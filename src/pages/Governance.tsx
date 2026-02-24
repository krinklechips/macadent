import DocumentPageLayout from "../components/DocumentPageLayout";
import { companyIdentity, complianceCredentials } from "../data/siteContent";

const sections = [
  { id: "company-identity", label: "Company Identity" },
  { id: "licensing", label: "Licensing & Compliance References" },
  { id: "operating-practices", label: "Operating Practices" },
  { id: "documentation", label: "Documentation Requests" }
] as const;

export default function Governance() {
  return (
    <DocumentPageLayout
      eyebrow="Governance"
      title="Governance & Compliance"
      summary="Corporate identity, licensing references, and documentation practices supporting Macadent Sdn Bhd’s equipment and materials business operations."
      updatedOn="February 23, 2026"
      sections={sections}
    >
      <section id="company-identity" className="document-block">
        <h2>Company Identity</h2>
        <div className="document-fact-grid">
          <div className="document-fact-card">
            <p className="document-fact-label">Legal Name</p>
            <p className="document-fact-value">{companyIdentity.legalName}</p>
          </div>
          <div className="document-fact-card">
            <p className="document-fact-label">Trade Name</p>
            <p className="document-fact-value">{companyIdentity.tradeName}</p>
          </div>
          <div className="document-fact-card">
            <p className="document-fact-label">Business Registration</p>
            <p className="document-fact-value">{companyIdentity.businessRegistration}</p>
          </div>
          <div className="document-fact-card">
            <p className="document-fact-label">Primary Contact</p>
            <p className="document-fact-value">sales@macadent.com.my</p>
          </div>
        </div>
      </section>

      <section id="licensing" className="document-block">
        <h2>Licensing & Compliance References</h2>
        <p>
          The following references are listed for procurement review and compliance screening.
          Supporting copies and validity periods can be shared directly upon request.
        </p>
        <div className="document-credential-list">
          {complianceCredentials.map((credential) => (
            <article key={credential.reference} className="document-credential-item">
              <div>
                <p className="document-fact-label">{credential.category}</p>
                <h3>{credential.title}</h3>
                <p>{credential.note}</p>
              </div>
              <p className="document-credential-ref">{credential.reference}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="operating-practices" className="document-block">
        <h2>Operating Practices</h2>
        <ul>
          <li>Product and project recommendations are reviewed against clinic workflow, scope, and budget requirements.</li>
          <li>Regulatory and licensing documentation is maintained for procurement and onboarding review.</li>
          <li>Commercial discussions, quotations, and deployment plans are finalized through direct communication with the sales/support team.</li>
          <li>Website content is maintained as a commercial information resource and not a substitute for project-specific validation.</li>
        </ul>
      </section>

      <section id="documentation" className="document-block">
        <h2>Documentation Requests</h2>
        <p>
          To request compliance documents, license copies, or company credentials for procurement onboarding, email <a href="mailto:sales@macadent.com.my">sales@macadent.com.my</a> or use the <a href="/contact">Contact page</a> with your clinic or organization details.
        </p>
      </section>
    </DocumentPageLayout>
  );
}
