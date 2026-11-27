/** JSON-LD (schema.org) builders. Only verifiable facts, no location. */
import { SITE, abs } from '../config/site';
import { founder } from '../data/founder';
import type { Service } from '../data/services';

const ORG_ID = abs('/#organization');
const SITE_ID = abs('/#website');
const FOUNDER_ID = abs('/about/#rajdeep-sah');

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: abs('/brand/siya-labs-app-icon.png'), width: 512, height: 512 },
    email: SITE.email,
    description: SITE.description,
    founder: { '@id': FOUNDER_ID },
    knowsAbout: [
      'Artificial intelligence',
      'Workflow automation',
      'AI agents',
      'Cybersecurity',
      'Vulnerability management',
      'Software testing',
      'Quality assurance',
      'Web development',
      'Software engineering',
    ],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: abs('/'),
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function founderSchema() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: founder.name,
    jobTitle: founder.role,
    worksFor: { '@id': ORG_ID },
    url: abs('/about/'),
    sameAs: founder.links.map((l) => l.href),
  };
}

export function serviceSchema(service: Service) {
  return {
    '@type': 'Service',
    '@id': abs(`/services/${service.slug}/#service`),
    name: service.name,
    serviceType: service.name,
    description: service.seoDescription,
    url: abs(`/services/${service.slug}/`),
    provider: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
