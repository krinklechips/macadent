import { useEffect } from "react";

type UsePageSeoOptions = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL?.trim() || "https://macadent.com.my").replace(
  /\/+$/,
  ""
);

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
    return meta;
  }

  Object.entries(attrs).forEach(([key, value]) => {
    meta?.setAttribute(key, value);
  });

  return meta;
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

export function usePageSeo({ title, description, path, robots = "index, follow" }: UsePageSeoOptions) {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_ORIGIN).toString();

    document.title = title;
    upsertCanonical(canonicalUrl);

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description
    });
  }, [description, path, robots, title]);
}

export { SITE_ORIGIN };
