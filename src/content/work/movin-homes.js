// CASE STUDY schema (template for all /work/* pages).
// Rendered by src/routes/CaseStudy.jsx. `service` links up to the hub;
// related.articles link across. Lead with the metric.
export default {
  slug: 'movin-homes',
  order: 5,
  title: 'Movin Homes — PropTech AI Marketplace',
  subtitle: 'A data-driven property marketplace that flags undervalued homes for 7-day flips',
  service: 'ai-automation',
  serviceName: 'AI Workflow Automation',

  seo: {
    title: 'Case Study: PropTech AI Marketplace for 7-Day Property Flips',
    description:
      'How I built Movin Homes as CTO and co-founder — a Python/Streamlit engine that scrapes live market data, uses variance mapping and sale velocity to flag undervalued properties for 7-day flips at 12% margins, plus a React marketplace scaling a 100+ broker network. SPC Fall 2025 finalist.',
  },

  client: 'Movin Homes (co-founded venture)',
  role: 'CTO & co-founder — architecture, data engine, full build',
  timeframe: '2025',
  status: 'LAUNCHED',

  summary:
    'A dual-sided PropTech marketplace I built as CTO and co-founder. A Python and Streamlit analytics engine scrapes live market data from sources like 99acres and Housing.com, then applies variance mapping and sale-velocity analysis to flag undervalued properties — enabling 7-day flips at roughly 12% margins. A React and Tailwind consumer marketplace onboards buyers, sellers and brokers, scaling a network of 100+ brokers. The venture reached the South Park Commons Fall 2025 finals.',

  problem: [
    'Property arbitrage lives or dies on speed and signal. Spotting a genuinely undervalued listing means comparing it against live comparable sales, local price variance, and how fast similar homes are actually moving — work that is slow and error-prone when done by hand across fragmented portals.',
    'On top of the data problem, a flip business needs deal flow. Without a marketplace that brings buyers, sellers and brokers into one place, even perfectly priced inventory has nowhere to transact quickly enough to hit a 7-day turnaround.',
  ],

  approach: [
    { title: 'Live market-data scraping', desc: 'A Python scraping layer pulls current listings and sold data from sources like 99acres and Housing.com, normalizing them into one comparable dataset for analysis.' },
    { title: 'Variance mapping', desc: 'The engine maps price variance across micro-markets to find listings priced well below their local comparable band — the core undervaluation signal.' },
    { title: 'Sale-velocity analysis', desc: 'Sale velocity gauges how fast similar homes actually move, so flagged deals are not just cheap but liquid enough to flip inside the target window.' },
    { title: 'Streamlit analytics surface', desc: 'A Streamlit app turns the pipeline into an internal dashboard where the team reviews flagged opportunities and acts on 7-day flips at roughly 12% margins.' },
    { title: 'Two-sided marketplace', desc: 'A React and Tailwind consumer marketplace onboards buyers, sellers and brokers, with flows built to scale a network of 100+ brokers feeding deal flow.' },
  ],

  results: [
    { metric: '7-day', label: 'flip cycle at ~12% margins' },
    { metric: '100+', label: 'broker network onboarded' },
    { metric: 'SPC', label: 'Fall 2025 finalist' },
    { metric: 'Live', label: 'market-data scraping pipeline' },
  ],

  stack: ['Python', 'Streamlit', 'Web Scraping', 'Data Analytics', 'React', 'Tailwind'],

  testimonial: null,
  video: '/videos/portfolio/Movin Homes.mp4',

  related: {
    articles: ['ai-automation-cost'],
  },
};
