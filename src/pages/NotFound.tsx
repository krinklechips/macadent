import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Page not found</p>
        <h2>We could not find that page.</h2>
        <p className="section-subtitle">
          Use the navigation above or return to the homepage.
        </p>
      </div>
      <Link className="button primary" to="/">Back to Home</Link>
    </section>
  );
}
