/**
 * Content for the five core services. Drives the home index, /services,
 * each /services/[slug] page, the footer, the mobile menu and JSON-LD.
 *
 * "applications" are typical uses of each service, not past client work.
 */
export type ServiceSlug =
  | 'ai-automation'
  | 'cybersecurity'
  | 'ai-software-testing'
  | 'software-development'
  | 'ai-assistants';

export interface Service {
  slug: ServiceSlug;
  number: string;
  name: string;
  short: string;
  summary: string;
  lede: string;
  seoTitle: string;
  seoDescription: string;
  highlights: [string, string, string];
  capabilities: { title: string; text: string }[];
  approach: { title: string; text: string }[];
  applications: string[];
  graphicLabel: string;
}

export const services: Service[] = [
  {
    slug: 'ai-automation',
    number: '01',
    name: 'AI Automation',
    short: 'Automate business tasks and workflows using AI.',
    summary:
      'We find the repetitive, high-volume work that slows your team down and turn it into dependable AI-powered workflows connected to the tools you already use.',
    lede: 'Most teams lose hours every week to work that follows a pattern: reading, sorting, copying, checking, and following up. We design AI workflows that take on that work reliably, with people kept in control of the decisions that matter.',
    seoTitle: 'AI Automation Services',
    seoDescription:
      'Siya Labs designs AI-powered workflows that automate repetitive business tasks, from document processing to integrations and reporting, with people in control.',
    highlights: [
      'Workflow discovery and design',
      'Document and email processing',
      'Integrations with your existing systems',
    ],
    capabilities: [
      {
        title: 'Workflow discovery',
        text: 'We map how work actually moves through your team and find where automation saves the most time with the least risk.',
      },
      {
        title: 'Document and email processing',
        text: 'Extract, classify, and route information from emails, forms, PDFs, and invoices into the systems where it belongs.',
      },
      {
        title: 'System integrations',
        text: 'Connect CRMs, ticketing tools, spreadsheets, databases, and internal apps through their APIs, so data moves without manual copying.',
      },
      {
        title: 'AI decision steps',
        text: 'Language models handle the judgment-heavy steps, such as summarizing, categorizing, and drafting, with clear rules for when a person reviews the result.',
      },
      {
        title: 'Human-in-the-loop controls',
        text: 'Approval steps, confidence thresholds, and simple overrides keep your team in charge of anything consequential.',
      },
      {
        title: 'Monitoring and cost control',
        text: 'Every run is logged and measurable, with alerts for failures and clear visibility into usage and spend.',
      },
    ],
    approach: [
      {
        title: 'Map',
        text: 'Document the current process, its inputs and exceptions, and agree on what success looks like.',
      },
      {
        title: 'Automate',
        text: 'Build the workflow in small, testable stages, starting with the step that matters most.',
      },
      {
        title: 'Measure',
        text: 'Run it alongside your team, track accuracy and time saved, and refine it until it is dependable.',
      },
    ],
    applications: [
      'Sorting inbound requests and routing them to the right person or queue',
      'Pulling data from invoices, forms, and contracts into your systems',
      'Drafting first versions of routine reports, replies, and summaries',
      'Keeping records in sync across tools that don’t talk to each other',
    ],
    graphicLabel:
      'Diagram: incoming items flow through an AI step and are routed automatically to three different systems.',
  },
  {
    slug: 'cybersecurity',
    number: '02',
    name: 'Cybersecurity SaaS',
    short: 'Security monitoring and vulnerability management tools.',
    summary:
      'We develop security software that continuously watches your systems, surfaces vulnerabilities, and helps your team fix what matters first.',
    lede: 'Security work breaks down when teams can’t see what they run or can’t tell which problems matter. We build monitoring and vulnerability management tools that make exposure visible, prioritize it by real risk, and track it through to resolution.',
    seoTitle: 'Cybersecurity SaaS: Security Monitoring & Vulnerability Management',
    seoDescription:
      'Siya Labs develops security monitoring and vulnerability management software that helps teams see exposure, prioritize real risk, and track every fix.',
    highlights: ['Continuous security monitoring', 'Vulnerability management', 'Risk-based prioritization'],
    capabilities: [
      {
        title: 'Asset visibility',
        text: 'Keep an up-to-date inventory of the systems, services, and software you are responsible for protecting.',
      },
      {
        title: 'Continuous monitoring',
        text: 'Watch for configuration changes, exposed services, and suspicious activity, with alerts that are specific and actionable.',
      },
      {
        title: 'Vulnerability scanning',
        text: 'Identify known vulnerabilities and misconfigurations across your infrastructure and applications.',
      },
      {
        title: 'Risk-based prioritization',
        text: 'Rank findings by severity, exposure, and business impact, so effort goes where it reduces the most risk.',
      },
      {
        title: 'Remediation tracking',
        text: 'Assign, track, and verify fixes, with integrations into the ticketing tools your team already uses.',
      },
      {
        title: 'Clear reporting',
        text: 'Plain-language dashboards and reports that show your security posture and how it changes over time.',
      },
    ],
    approach: [
      { title: 'See', text: 'Discover what you run and where you are exposed.' },
      { title: 'Prioritize', text: 'Separate the critical few from the noise using context, not just scores.' },
      { title: 'Resolve', text: 'Turn findings into tracked work and confirm that each fix holds.' },
    ],
    applications: [
      'Understanding which of your systems are exposed to the internet',
      'Deciding which vulnerabilities to patch first',
      'Tracking remediation across teams until each fix is verified',
      'Giving leadership a clear, regular view of security posture',
    ],
    graphicLabel:
      'Diagram: a scan sweeps across a grid of systems, flags one vulnerability, and marks it resolved once fixed.',
  },
  {
    slug: 'ai-software-testing',
    number: '03',
    name: 'AI Software Testing',
    short: 'Automated software testing and quality assurance.',
    summary:
      'We combine proven test automation with AI to help teams ship faster and with fewer defects, from test design to failure analysis.',
    lede: 'Quality problems are cheapest to fix before they reach your users. We build automated test suites and AI-assisted QA workflows that catch regressions early, explain failures clearly, and fit into the way your team already ships.',
    seoTitle: 'AI Software Testing & QA Automation Services',
    seoDescription:
      'Siya Labs provides automated software testing and AI-assisted quality assurance: UI, API, and integration tests, failure triage, and CI/CD integration.',
    highlights: [
      'Test automation for UI, API, and integrations',
      'AI-assisted test design and failure triage',
      'CI/CD integration',
    ],
    capabilities: [
      {
        title: 'Test strategy',
        text: 'Assess current coverage and risk, then decide what to automate first and how to measure quality.',
      },
      {
        title: 'UI and end-to-end testing',
        text: 'Reliable browser tests for critical user journeys, using frameworks such as Playwright and Selenium.',
      },
      {
        title: 'API and integration testing',
        text: 'Functional, contract, and regression tests for the services your product depends on.',
      },
      {
        title: 'AI-assisted test design',
        text: 'Language models propose test cases and edge cases from requirements, tickets, and code changes, reviewed by engineers.',
      },
      {
        title: 'Failure triage',
        text: 'Group failures automatically, summarize likely causes, and draft clear defect reports for your issue tracker.',
      },
      {
        title: 'CI/CD integration',
        text: 'Run the right tests on every change, with fast feedback and readable reports in your pipeline.',
      },
    ],
    approach: [
      {
        title: 'Assess',
        text: 'Review your product, release process, and existing tests to find the biggest quality risks.',
      },
      {
        title: 'Automate',
        text: 'Build a maintainable suite around the journeys that matter most, then widen coverage.',
      },
      {
        title: 'Integrate',
        text: 'Wire tests and AI triage into your pipeline and issue tracker, so quality is visible on every change.',
      },
    ],
    applications: [
      'Building a regression suite for an application with little test coverage',
      'Analyzing and categorizing QA tickets automatically',
      'Adding fast, reliable checks to a CI/CD pipeline',
      'Reducing flaky tests and the time spent investigating failures',
    ],
    graphicLabel:
      'Diagram: a test suite runs case by case; one failure is analyzed by an AI triage step and passes on re-run.',
  },
  {
    slug: 'software-development',
    number: '04',
    name: 'Web & Software Development',
    short: 'Websites, applications, custom software, and APIs.',
    summary:
      'We design and engineer fast, secure, maintainable software, from company websites and web apps to internal tools and APIs.',
    lede: 'Good software is quick to use, easy to change, and secure by design. We build websites, applications, and APIs with modern, well-supported technology, and hand them over with the documentation your team needs to own them.',
    seoTitle: 'Web & Software Development Services',
    seoDescription:
      'Siya Labs builds fast, secure, maintainable websites, web apps, custom software, and APIs with modern technology such as React, Next.js, FastAPI, and Node.js.',
    highlights: ['Websites and web applications', 'Custom software and internal tools', 'APIs and integrations'],
    capabilities: [
      {
        title: 'Websites',
        text: 'Fast, accessible, search-friendly websites that represent your business clearly and are easy to update.',
      },
      {
        title: 'Web applications',
        text: 'Customer portals, dashboards, and SaaS products built with frameworks such as React and Next.js.',
      },
      {
        title: 'Custom software and internal tools',
        text: 'Purpose-built tools that replace spreadsheets and manual processes with something reliable.',
      },
      {
        title: 'APIs and integrations',
        text: 'Well-documented REST APIs and integrations, built with tools such as FastAPI and Node.js.',
      },
      {
        title: 'Data and infrastructure',
        text: 'Sound data models on PostgreSQL, MongoDB, or Supabase, deployed on dependable cloud infrastructure such as AWS.',
      },
      {
        title: 'Maintenance and support',
        text: 'Updates, monitoring, and improvements after launch, so your software keeps working as you grow.',
      },
    ],
    approach: [
      { title: 'Plan', text: 'Define users, requirements, and architecture before writing code.' },
      {
        title: 'Build',
        text: 'Ship in short iterations you can see and test, with automated tests from the start.',
      },
      { title: 'Hand over', text: 'Deploy, document, and support the software so it is truly yours.' },
    ],
    applications: [
      'A company website that loads quickly and is easy to find',
      'A customer portal or dashboard for your service',
      'An internal tool that replaces a fragile spreadsheet',
      'An API that connects your product with partners or other systems',
    ],
    graphicLabel:
      'Diagram: a web application interface assembles on a layout grid while an API feeds it data.',
  },
  {
    slug: 'ai-assistants',
    number: '05',
    name: 'AI Business Assistants',
    short: 'Intelligent AI agents and assistants for businesses.',
    summary:
      'We build AI assistants and agents that answer from your own knowledge, take actions in your systems, and hand off to people when it matters.',
    lede: 'A useful assistant knows your business, works inside your tools, and is honest about what it doesn’t know. We build AI assistants and agents grounded in your own information, with the permissions, guardrails, and oversight a business needs.',
    seoTitle: 'AI Business Assistants & AI Agents',
    seoDescription:
      'Siya Labs builds AI assistants and agents for businesses, grounded in your knowledge, able to act in your systems, and designed with guardrails and oversight.',
    highlights: [
      'Knowledge assistants grounded in your documents',
      'Agents that take actions in your systems',
      'Guardrails, evaluation, and monitoring',
    ],
    capabilities: [
      {
        title: 'Knowledge assistants',
        text: 'Answer questions accurately from your documents, policies, and data, with sources your team can check.',
      },
      {
        title: 'Customer support assistants',
        text: 'Handle common questions on your website or help desk, and route complex cases to the right person.',
      },
      {
        title: 'Action-taking agents',
        text: 'Agents that look up records, update tickets, schedule, and draft, within permissions you define.',
      },
      {
        title: 'Where your team works',
        text: 'Deploy assistants on your website, in internal tools, or in workplace chat and email.',
      },
      {
        title: 'Guardrails and evaluation',
        text: 'Test assistants against real scenarios, limit what they can access, and measure answer quality before and after launch.',
      },
      {
        title: 'Privacy-conscious design',
        text: 'Clear data boundaries, access controls, and audit trails, designed with security in mind from the start.',
      },
    ],
    approach: [
      {
        title: 'Define',
        text: 'Choose the job the assistant should do, and the knowledge and tools it needs to do it.',
      },
      { title: 'Ground', text: 'Connect it to your sources and systems, with guardrails and permissions.' },
      {
        title: 'Evaluate',
        text: 'Test it against real questions, launch carefully, and keep improving it with feedback.',
      },
    ],
    applications: [
      'Answering customer questions from your documentation, at any hour',
      'Helping staff find policies, procedures, and internal knowledge',
      'Drafting responses and updating tickets for your support team',
      'Preparing briefs and summaries before meetings and calls',
    ],
    graphicLabel:
      'Diagram: an assistant answers a question in a chat, then calls a connected system to complete the task.',
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
