import { companyIdentity, complianceCredentials } from "../data/siteContent";

export default function Company() {
  return (
    <section className="section company-section">
      <div className="split company-overview-grid">
        <div className="company-panel">
          <p className="eyebrow">Company</p>
          <h2>{companyIdentity.tradeName}</h2>
          <p>{companyIdentity.subtitle}</p>
          <div className="company-fact-list" aria-label="Company registration details">
            <p className="company-fact">{companyIdentity.legalName}</p>
            <p className="company-fact">
              Business Reg: {companyIdentity.businessRegistration}
            </p>
          </div>
          <div className="pill-row">
            <span className="pill">Dental chairs</span>
            <span className="pill">Imaging systems</span>
            <span className="pill">Sterilization</span>
            <span className="pill">Utility support systems</span>
            <span className="pill">Materials &amp; consumables</span>
          </div>
        </div>
        <div className="company-panel highlight-panel">
          <p className="eyebrow">Highlights</p>
          <h3>Commercial support built around clinic rollout and continuity.</h3>
          <ul className="highlight-list">
            <li>Single point of contact for quotations, coordination, and follow-up.</li>
            <li>Equipment recommendations aligned to room layout, utilities, and treatment scope.</li>
            <li>Support for startup, expansion, replacement, and phased upgrade projects.</li>
            <li>Consumables sourcing support for recurring clinic operations and specialty needs.</li>
          </ul>
        </div>
      </div>

      <div className="company-panel company-licensing-panel">
        <p className="eyebrow">Licensing &amp; Compliance</p>
        <h3>Procurement onboarding references for device distribution and operations.</h3>
        <p className="company-licensing-lead">
          Key registration and licensing references are listed below for procurement review and
          vendor onboarding. The dedicated Governance page provides a consolidated compliance
          overview for documentation requests.
        </p>
        <div className="company-licensing-grid">
          {complianceCredentials.map((credential) => (
            <article key={credential.reference} className="company-license-card">
              <p className="company-license-category">{credential.category}</p>
              <h4>{credential.title}</h4>
              <p className="company-license-reference">{credential.reference}</p>
              <p className="company-license-note">{credential.note}</p>
            </article>
          ))}
        </div>
        <p className="company-license-footnote">
          Reference numbers are shown from documents on file for validation. Full copies, issuer
          details, and validity periods can be shared during procurement onboarding.
        </p>
      </div>
    </section>
  );
}
