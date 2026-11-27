/** Company-level copy shared by the home and about pages. */

export const principles = [
  {
    title: 'Useful before impressive.',
    text: 'We start with the work that needs doing, not the technology. If a simpler solution is better, we will say so.',
  },
  {
    title: 'Secure by default.',
    text: 'Security is designed in from the first decision, not added at the end.',
  },
  {
    title: 'Verified, not assumed.',
    text: 'Everything we build is tested, measured, and observable, so you know it works.',
  },
  {
    title: 'Yours to own.',
    text: 'Clear code, documentation, and handover. No black boxes and no lock-in.',
  },
] as const;

export const process = [
  { title: 'Understand', text: 'We learn how your business works and define the problem worth solving.' },
  {
    title: 'Design',
    text: 'We plan the system: architecture, data, security, and how we will measure success.',
  },
  { title: 'Build and verify', text: 'We deliver in small, tested increments you can see and use.' },
  { title: 'Launch and support', text: 'We deploy, monitor, document, and keep improving.' },
] as const;

export const mission = {
  mission: 'Make applied AI and strong security practical for every business.',
  vision:
    'A future where every organization, not only the largest, runs on software that is intelligent, secure, and built to last.',
} as const;

export const differentiators = [
  {
    title: 'Founder-led',
    text: 'Every engagement is shaped directly by the person accountable for the company’s work.',
  },
  {
    title: 'Research-informed',
    text: 'We follow the evidence on what AI can and can’t do, and design around both.',
  },
  {
    title: 'Security-first',
    text: 'Security thinking runs through everything we build, not only our security products.',
  },
  {
    title: 'One team, full stack',
    text: 'AI, security, testing, and software engineering under one roof, so nothing falls through the cracks.',
  },
] as const;

export const nextSteps = [
  { title: 'We read your message', text: 'Every inquiry is read and answered personally.' },
  { title: 'We talk it through', text: 'A short call to understand your goals, constraints, and timeline.' },
  { title: 'You get a clear proposal', text: 'Scope, approach, timeline, and cost, in plain language.' },
] as const;
