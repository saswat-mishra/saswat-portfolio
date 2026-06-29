// schema.org JSON-LD builders. Each returns a plain object that <Seo> serializes
// into a <script type="application/ld+json"> via Helmet, so it lands in the
// prerendered static HTML for Google rich results and AI-search citation.

import { SITE, PERSON_ID, WEBSITE_ID, abs, KNOWS_ABOUT } from '../site.config.js';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    givenName: 'Saswat',
    familyName: 'Mishra',
    jobTitle: SITE.founder.jobTitle,
    description:
      'Freelance AI agent developer and senior machine learning engineer from IIT Delhi with 5+ years building production-grade AI systems — autonomous multi-agent systems, LangGraph, LLM integration, voice AI, and RAG.',
    url: abs('/'),
    image: abs(SITE.ogImage),
    email: SITE.email,
    knowsAbout: KNOWS_ABOUT,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: SITE.founder.alumni,
      alternateName: 'IIT Delhi',
      url: 'https://home.iitd.ac.in',
    },
    sameAs: [SITE.social.linkedin, SITE.social.github, SITE.social.upwork],
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
    publisher: { '@id': PERSON_ID },
  };
}

export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs('/'),
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
    provider: { '@id': PERSON_ID },
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
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
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
    creator: { '@id': PERSON_ID },
    about: work.serviceName,
  };
}
