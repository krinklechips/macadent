import DocumentPageLayout from "../components/DocumentPageLayout";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "sharing", label: "Sharing & Disclosure" },
  { id: "retention-security", label: "Retention & Security" },
  { id: "choices", label: "Your Choices" },
  { id: "contact", label: "Privacy Contact" }
] as const;

export default function PrivacyPolicy() {
  return (
    <DocumentPageLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      summary="How Macadent Sdn Bhd handles information submitted through this website, including quote requests and clinic planning enquiries."
      updatedOn="February 23, 2026"
      sections={sections}
    >
      <section id="overview" className="document-block">
        <h2>Overview</h2>
        <p>
          This website is operated by Macadent Sdn Bhd for product information,
          clinic planning support, and sales enquiries. This Privacy Policy explains what
          information we collect through this website, how we use it, and how you can contact us
          regarding privacy-related questions.
        </p>
        <p>
          Please do not submit patient records, patient identifiers, or other sensitive clinical
          information through the public contact forms on this website.
        </p>
      </section>

      <section id="information-we-collect" className="document-block">
        <h2>Information We Collect</h2>
        <h3>Information you provide directly</h3>
        <ul>
          <li>Name, email address, phone number, and clinic/company details.</li>
          <li>Enquiry type, product interest, budget range, timeline, and preferred contact method.</li>
          <li>Messages submitted through quote, consultation, or contact forms.</li>
          <li>Layout Studio exports or planning information you choose to share with us.</li>
        </ul>
        <h3>Technical and usage information</h3>
        <ul>
          <li>Basic device/browser information and page access logs processed by hosting infrastructure.</li>
          <li>Website usage events necessary for performance, troubleshooting, and security monitoring.</li>
        </ul>
      </section>

      <section id="how-we-use" className="document-block">
        <h2>How We Use Information</h2>
        <p>We use information collected through this website to:</p>
        <ul>
          <li>Respond to enquiries, quotations, and consultation requests.</li>
          <li>Recommend equipment, materials, and clinic workflow options.</li>
          <li>Coordinate site visits, planning discussions, and after-sales follow-up.</li>
          <li>Maintain website operations, security, and service reliability.</li>
          <li>Improve product pages, support materials, and user experience.</li>
        </ul>
      </section>

      <section id="sharing" className="document-block">
        <h2>Sharing & Disclosure</h2>
        <p>
          We do not sell personal information collected through this website. We may share limited
          information when necessary with:
        </p>
        <ul>
          <li>Service providers supporting hosting, communications, or website operations.</li>
          <li>Internal team members and authorized representatives handling your request.</li>
          <li>Regulatory or legal authorities where disclosure is required by law.</li>
          <li>Professional advisers in connection with compliance, legal, or audit matters.</li>
        </ul>
      </section>

      <section id="retention-security" className="document-block">
        <h2>Retention & Security</h2>
        <p>
          We retain enquiry and contact records for as long as reasonably necessary to respond to
          your request, maintain commercial records, and support after-sales communications. We use
          reasonable administrative and technical safeguards appropriate for a business enquiry site,
          but no internet transmission or storage system is guaranteed to be fully secure.
        </p>
      </section>

      <section id="choices" className="document-block">
        <h2>Your Choices</h2>
        <ul>
          <li>You may request updates or corrections to the contact information you submitted.</li>
          <li>You may ask us to stop contacting you for a specific enquiry or sales follow-up.</li>
          <li>You may request details on the records we hold in connection with your website enquiry, subject to applicable law.</li>
        </ul>
      </section>

      <section id="contact" className="document-block">
        <h2>Privacy Contact</h2>
        <p>
          For privacy-related questions about this website, contact Macadent Sdn Bhd
          at <a href="mailto:sales@macadent.com.my">sales@macadent.com.my</a> or via the <a href="/contact">Contact page</a>.
        </p>
      </section>
    </DocumentPageLayout>
  );
}
