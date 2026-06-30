// schema.org JSON-LD builders. Each returns a plain object that <Seo> serializes
// into a <script type="application/ld+json"> via Helmet, so it lands in the
// prerendered static HTML for Google rich results and AI-search citation.

import { SITE, PERSON_ID, ORG_ID, WEBSITE_ID, abs, KNOWS_ABOUT, sameAs } from '../site.config.js';

// Reusable inline node references. We inline @type + @id + name (+ url/logo)
// rather than a bare { @id } so each page's schema is self-describing for
// Google's Rich Results Test, which does NOT resolve @id references across pages
// (the full Person/Organization nodes only live on Home + About).
const personRef = () => ({ '@type': 'Person', '@id': PERSON_ID, name: SITE.name, url: abs('/') });
const orgRef = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.brand,
  url: abs('/'),
  logo: { '@type': 'ImageObject', url: abs(SITE.ogImage) },
});

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    givenName: 'Saswat',
    familyName: 'Mishra',
    jobTitle: SITE.founder.jobTitle,
    // Canonical bio — same string used on About + footer (entity consistency).
    description: SITE.canonicalBio,
    url: abs('/'),
    mainEntityOfPage: abs('/about'),
    image: abs(SITE.ogImage),
    email: SITE.email,
    worksFor: { '@id': ORG_ID },
    knowsAbout: KNOWS_ABOUT,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: SITE.founder.alumni,
      alternateName: 'IIT Delhi',
      url: 'https://home.iitd.ac.in',
    },
    sameAs: sameAs(),
  };
}

/** The one-person studio behind the site. Founder → the canonical Person @id. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.brand,
    alternateName: SITE.name,
    url: abs('/'),
    logo: abs(SITE.ogImage),
    image: abs(SITE.ogImage),
    description: SITE.canonicalBio,
    email: SITE.email,
    founder: { '@id': PERSON_ID },
    knowsAbout: KNOWS_ABOUT,
    areaServed: ['US', 'GB', 'AE', 'SG'],
    sameAs: sameAs(),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: `${SITE.name} — AI Agent Developer`,
    url: abs('/'),
    description: SITE.description,
    inLanguage: 'en-US',
    publisher: { '@id': ORG_ID },
    // Valid SearchAction → the real client-side /search route (not a stub).
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs('/about'),
    mainEntity: { '@id': PERSON_ID },
  };
}

/** items: [{ name, path }] in order from Home → current page. */
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** service: { name, serviceType, description, path, offers?: [{name, description}] } */
export function serviceJsonLd(service) {
  const out = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.serviceType || service.name,
    description: service.description,
    url: abs(service.path),
    provider: personRef(),
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: abs('/contact'),
      serviceType: 'Online',
    },
  };
  if (service.offers?.length) {
    out.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: service.offers.map((o) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: o.name, description: o.description },
      })),
    };
  }
  return out;
}

/** faq: [{ q, a }] */
export function faqJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** post: { title, description, path, date, updated, image? } */
export function articleJsonLd(post) {
  // author = self-describing Person; publisher = Organization with a logo (the
  // shape Google recommends for Article). Both inline @id + name so they validate
  // standalone (Rich Results doesn't resolve @id across pages).
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: abs(post.path),
    mainEntityOfPage: abs(post.path),
    datePublished: post.date,
    dateModified: post.updated || post.date,
    image: abs(post.image || SITE.ogImage),
    author: personRef(),
    publisher: orgRef(),
  };
}

/** work: { title, description, path, date?, image? } → CreativeWork case study */
export function caseStudyJsonLd(work) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    headline: work.title,
    description: work.description,
    url: abs(work.path),
    image: abs(work.image || SITE.ogImage),
    creator: personRef(),
    about: work.serviceName,
  };
}
