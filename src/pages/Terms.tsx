import DocumentPageLayout from "../components/DocumentPageLayout";

const sections = [
  { id: "acceptance", label: "Acceptance" },
  { id: "use-of-site", label: "Use of Site" },
  { id: "product-information", label: "Product & Quote Information" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "limitations", label: "Disclaimers & Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" }
] as const;

export default function Terms() {
  return (
    <DocumentPageLayout
      eyebrow="Legal"
      title="Terms of Use"
      summary="Terms governing access to the Macadent website, product pages, contact forms, and planning tools."
      updatedOn="February 23, 2026"
      sections={sections}
    >
      <section id="acceptance" className="document-block">
        <h2>Acceptance</h2>
        <p>
          By accessing or using this website, you agree to these Terms of Use. If you do not agree,
          do not use the website. These terms apply to public pages, downloadable materials, quote
          enquiries, and interactive tools such as the Layout Studio.
        </p>
      </section>

      <section id="use-of-site" className="document-block">
        <h2>Use of Site</h2>
        <p>You may use this website for legitimate business and informational purposes, including:</p>
        <ul>
          <li>Reviewing equipment and materials information.</li>
          <li>Submitting quote or consultation enquiries.</li>
          <li>Using the Layout Studio for preliminary clinic planning concepts.</li>
          <li>Contacting Macadent Sdn Bhd for sales or support discussions.</li>
        </ul>
        <p>You may not use the website to:</p>
        <ul>
          <li>Interfere with system operation, security, or availability.</li>
          <li>Submit unlawful, misleading, or malicious content.</li>
          <li>Attempt unauthorized access to non-public systems or data.</li>
          <li>Use automated tools to scrape content at a volume that affects site performance.</li>
        </ul>
      </section>

      <section id="product-information" className="document-block">
        <h2>Product & Quote Information</h2>
        <p>
          Product listings, brands, workflow examples, and materials categories are provided for
          general commercial information. Availability, specifications, pricing, lead times, and
          regulatory applicability may change and should be confirmed directly with our team.
        </p>
        <p>
          Quotations or recommendations shared through the website or contact process are subject to
          final commercial review, availability, and project requirements.
        </p>
      </section>

      <section id="intellectual-property" className="document-block">
        <h2>Intellectual Property</h2>
        <p>
          Website content, design elements, copy, and original materials on this site are owned by
          Macadent Sdn Bhd or used with permission. Third-party brand names and marks
          remain the property of their respective owners.
        </p>
      </section>

      <section id="limitations" className="document-block">
        <h2>Disclaimers & Liability</h2>
        <p>
          This website is provided on an "as is" and "as available" basis for business information.
          We make reasonable efforts to keep content current, but we do not guarantee the website
          will always be error-free, uninterrupted, or suitable for a specific use case.
        </p>
        <p>
          To the extent permitted by applicable law, Macadent Sdn Bhd is not liable
          for indirect or consequential losses arising from use of the website or reliance on public
          content without direct confirmation.
        </p>
      </section>

      <section id="governing-law" className="document-block">
        <h2>Governing Law</h2>
        <p>
          These Terms of Use are governed by the applicable laws of Malaysia, without prejudice to
          any mandatory consumer or commercial protections that may apply in a specific case.
        </p>
      </section>

      <section id="contact" className="document-block">
        <h2>Contact</h2>
        <p>
          For questions regarding these Terms of Use, contact <a href="mailto:sales@macadent.com.my">sales@macadent.com.my</a> or visit the <a href="/contact">Contact page</a>.
        </p>
      </section>
    </DocumentPageLayout>
  );
}
