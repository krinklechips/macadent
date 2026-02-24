import CmsSlotSection from "../components/CmsSlotSection";
import { Link } from "react-router-dom";
import { productCategories } from "../data/productCatalog";
import { useCmsSlot } from "../hooks/useCmsSlot";
import { usePageSeo } from "../hooks/usePageSeo";

export default function ProductsLandingPage() {
  const featuredProductsSlot = useCmsSlot("macadent-products-featured");

  usePageSeo({
    title: "Products & Solutions | Macadent Malaysia",
    description:
      "Browse dental equipment and consumables categories from Macadent Malaysia, including chairs, imaging, sterilization, water filtration, handpieces, and clinical supplies.",
    path: "/products"
  });

  return (
    <section className="section products-landing-page">
      <div className="section-heading products-landing-head">
        <p className="eyebrow">Products & Solutions</p>
        <h2>Shop by category</h2>
        <p className="section-subtitle">
          Browse dedicated category pages for equipment systems and consumables. Each category page
          includes tailored guidance, product groupings, and enquiry-ready selection notes.
        </p>
      </div>

      <section className="products-landing-hero-card">
        <div>
          <p className="eyebrow">Quote-Based Catalogue</p>
          <h3>Category-first browsing for procurement support (without online checkout).</h3>
          <p>
            Use category pages to shortlist systems or consumables, compare product families, and
            submit clearer quote requests to the Macadent team.
          </p>
        </div>
        <div className="products-landing-hero-actions">
          <Link className="button primary" to="/contact">
            Request a Quote
          </Link>
          <a
            className="button ghost"
            href="https://wa.me/60169090913"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Enquiry
          </a>
        </div>
      </section>

      <CmsSlotSection
        data={featuredProductsSlot.data}
        eyebrow="CMS-Ready Slot"
        fallbackTitle="Procurement programs and highlights"
        subtitle="Assign content items to the `macadent-products-featured` slot in your CMS platform to publish updates here."
      />

      <section className="catalog-section">
        <div className="section-copy">
          <p className="eyebrow">Shop by Category</p>
          <h3>Open a dedicated page for each equipment or consumables group.</h3>
          <p>
            Every category below has its own hero, subcategory browse cards, featured brands,
            selection guide, and searchable product family grid.
          </p>
        </div>

        <div className="products-landing-grid">
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/products/${category.slug}`}
              className="products-landing-card"
            >
              <div className="products-landing-card-image-shell">
                {category.heroImage ? (
                  <img src={category.heroImage} alt={category.title} className="products-landing-card-image" />
                ) : (
                  <div className="products-landing-card-image-placeholder" aria-hidden="true">
                    <span>{category.title.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
                  </div>
                )}
              </div>
              <div className="products-landing-card-body">
                <p className="products-landing-card-kicker">Category</p>
                <h4>{category.title}</h4>
                <p>{category.landingDescription}</p>
                <span className="products-landing-card-link">Open category page →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
