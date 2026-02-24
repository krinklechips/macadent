import { useDeferredValue, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductCategoryBySlug,
  getProductFamiliesForCategory,
  productCategorySidebarLinks,
  type ProductCatalogSection
} from "../data/productCatalog";
import { usePageSeo } from "../hooks/usePageSeo";
import NotFound from "./NotFound";

type SortOption = "featured" | "az" | "price";

const getSection = <T extends ProductCatalogSection["type"]>(
  sections: ProductCatalogSection[],
  type: T
) => sections.find((section): section is Extract<ProductCatalogSection, { type: T }> => section.type === type);

const getBrandInitials = (name: string) =>
  name
    .split(/[\s/&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function CategoryPage() {
  const { categorySlug } = useParams();

  if (!categorySlug) {
    return <NotFound />;
  }

  const category = getProductCategoryBySlug(categorySlug);
  if (!category) {
    return <NotFound />;
  }

  const families = getProductFamiliesForCategory(category.slug);
  const seoDescription = `${category.intro} Browse subcategories, featured brands, selection guidance, and product families for quotation support.`;
  usePageSeo({
    title: `${category.title} | Macadent Malaysia`,
    description: seoDescription.slice(0, 160),
    path: `/products/${category.slug}`
  });

  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const deferredSearch = useDeferredValue(search);

  const whyMatters = getSection(category.sections, "why-matters");
  const shopByType = getSection(category.sections, "shop-by-type");
  const selectionGuide = getSection(category.sections, "selection-guide");
  const ctaSection = getSection(category.sections, "cta");

  const brandOptions = Array.from(
    new Set(families.map((family) => family.brand).filter((brand): brand is string => Boolean(brand)))
  ).sort();
  const typeOptions = Array.from(new Set(families.map((family) => family.subcategory))).sort();

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredFamilies = families
    .filter((family) => (brandFilter === "all" ? true : family.brand === brandFilter))
    .filter((family) => (typeFilter === "all" ? true : family.subcategory === typeFilter))
    .filter((family) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        family.name,
        family.shortDesc,
        family.subcategory,
        family.brand ?? "",
        ...family.tags
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    })
    .sort((a, b) => {
      if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price") {
        const aPrice = a.priceFrom ?? Number.POSITIVE_INFINITY;
        const bPrice = b.priceFrom ?? Number.POSITIVE_INFINITY;
        if (aPrice === bPrice) {
          return a.name.localeCompare(b.name);
        }
        return aPrice - bPrice;
      }

      const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDelta !== 0) {
        return featuredDelta;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <section className="section product-category-page">
      <div className="product-category-layout">
        <aside className="product-category-sidebar" aria-label="Product categories">
          <div className="product-category-sidebar-card">
            <p className="eyebrow">Shop by category</p>
            <nav className="product-category-sidebar-nav">
              {productCategorySidebarLinks.map((item) => (
                <Link
                  key={item.slug}
                  to={`/products/${item.slug}`}
                  className={`product-category-sidebar-link${item.slug === category.slug ? " active" : ""}`}
                  aria-current={item.slug === category.slug ? "page" : undefined}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="product-category-sidebar-card product-category-sidebar-card--subtle">
            <p className="product-category-side-title">Need help shortlisting?</p>
            <p>
              Send your clinic requirements and we will recommend a suitable starting list for this
              category.
            </p>
            <Link className="document-inline-link" to="/contact">
              Contact Sales
            </Link>
          </div>
        </aside>

        <div className="product-category-content">
          <section className="product-category-hero">
            <div className="product-category-hero-copy">
              <p className="eyebrow">Products &amp; Solutions</p>
              <h1>{category.title}</h1>
              <p className="product-category-hero-intro">{category.intro}</p>
              {whyMatters && (
                <div className="product-category-why-card">
                  <p className="product-category-section-label">{whyMatters.title}</p>
                  <ul className="product-category-bullets">
                    {whyMatters.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="product-category-hero-media">
              {category.heroImage ? (
                <img src={category.heroImage} alt={category.title} />
              ) : (
                <div className="product-category-hero-placeholder" aria-hidden="true">
                  <span>{getBrandInitials(category.title)}</span>
                </div>
              )}
            </div>
          </section>

          {shopByType && (
            <section className="catalog-section">
              <div className="section-copy">
                <p className="eyebrow">Shop by type</p>
                <h3>{shopByType.title}</h3>
                <p>Browse the major subcategory groupings commonly used for this category.</p>
              </div>

              <div className="product-category-type-grid">
                {shopByType.items.map((item) => (
                  <article key={item.name} className="product-category-type-card">
                    <p className="product-category-type-label">Subcategory</p>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="catalog-section">
            <div className="section-copy">
              <p className="eyebrow">Featured brands</p>
              <h3>Brand focus for this category.</h3>
              <p>Representative brands and product lines commonly discussed for this category.</p>
            </div>

            <div className="product-category-brand-grid">
              {category.featuredBrands.map((brand) => (
                <article key={brand.name} className="product-category-brand-card">
                  <div className="product-category-brand-logo" aria-hidden="true">
                    {getBrandInitials(brand.name)}
                  </div>
                  <div>
                    <p className="product-category-brand-name">{brand.name}</p>
                    {brand.label && <p className="product-category-brand-note">{brand.label}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {selectionGuide && (
            <section className="catalog-section">
              <div className="section-copy">
                <p className="eyebrow">Selection guide</p>
                <h3>{selectionGuide.title}</h3>
                <p>Shortlist faster by reviewing the category-specific considerations below.</p>
              </div>

              <div className="product-category-guide-panel">
                <ul className="product-category-guide-list">
                  {selectionGuide.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section className="catalog-section">
            <div className="section-copy">
              <p className="eyebrow">Product families</p>
              <h3>Filter and browse product groupings for {category.title.toLowerCase()}.</h3>
              <p>
                Use search, brand, and type filters to narrow the list. Pricing is shown only when
                category-level indicative pricing is available.
              </p>
            </div>

            <div className="product-family-controls">
              <label className="product-family-control">
                <span>Search</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${category.title.toLowerCase()}`}
                />
              </label>

              <label className="product-family-control">
                <span>Brand</span>
                <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                  <option value="all">All brands</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="product-family-control">
                <span>Type</span>
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                  <option value="all">All types</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="product-family-control">
                <span>Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                >
                  <option value="featured">Featured</option>
                  <option value="az">A-Z</option>
                  <option value="price">Price (if available)</option>
                </select>
              </label>
            </div>

            <div className="product-family-results-head">
              <p>{filteredFamilies.length} product families shown</p>
            </div>

            <div className="product-family-grid">
              {filteredFamilies.map((family) => (
                <article key={family.id} className="product-family-card">
                  <div className="product-family-card-media">
                    {family.image ? (
                      <img src={family.image} alt={family.name} loading="lazy" />
                    ) : (
                      <div className="product-family-card-placeholder" aria-hidden="true">
                        <span>{getBrandInitials(family.subcategory)}</span>
                      </div>
                    )}
                  </div>

                  <div className="product-family-card-body">
                    <div className="product-family-card-head">
                      <p className="product-family-subcategory">{family.subcategory}</p>
                      {family.brand && <p className="product-family-brand">{family.brand}</p>}
                    </div>
                    <h4>{family.name}</h4>
                    <p className="product-family-desc">{family.shortDesc}</p>

                    <ul className="product-family-specs">
                      {family.keySpecs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>

                    <div className="product-family-tags">
                      {family.tags.map((tag) => (
                        <span key={`${family.id}-${tag}`} className="product-family-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="product-family-card-footer">
                      <p className="product-family-price">
                        {family.priceFrom ? `From RM${family.priceFrom.toLocaleString()}` : "Pricing on request"}
                      </p>
                      <Link
                        to="/contact"
                        className={`product-family-card-cta${
                          family.ctaType === "Learn more" ? " ghost" : ""
                        }`}
                      >
                        {family.ctaType}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!filteredFamilies.length && (
              <div className="product-family-empty">
                <p>No product families match your current filters.</p>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => {
                    setSearch("");
                    setBrandFilter("all");
                    setTypeFilter("all");
                    setSortBy("featured");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>

          {ctaSection && (
            <section className="product-category-cta">
              <div>
                <p className="eyebrow">Request Support</p>
                <h3>{ctaSection.title}</h3>
                <p>{ctaSection.body}</p>
              </div>
              <div className="product-category-cta-actions">
                <Link className="button primary" to={ctaSection.primaryHref}>
                  {ctaSection.primaryLabel}
                </Link>
                <a
                  className="button ghost"
                  href={ctaSection.secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ctaSection.secondaryLabel}
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
