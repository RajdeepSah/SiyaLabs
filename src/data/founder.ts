/**
 * Founder facts. Every item here is taken from rajdeep.officialework.com or
 * the resume linked from it (retrieved 2026-11-26). Do not add claims that
 * are not verifiable from those sources.
 */
export const founder = {
  name: 'Rajdeep Sah',
  role: 'Founder & CEO',
  // Verbatim from rajdeep.officialework.com
  quote:
    'Naturally curious about the ‘why’ behind things, I turn complex ideas in AI and mathematical modeling into practical, data-driven systems.',
  bio: [
    'Rajdeep Sah is the founder and CEO of Siya Labs. Rajdeep’s work sits at the intersection of code and mathematics, spanning AI research, software engineering, and quality engineering.',
    'Rajdeep co-authored peer-reviewed research on how students and faculty use generative AI, published in Issues in Information Systems and presented at the IACIS 2025 conference. As a Quality Engineering and AI Research Intern at FireMon, Rajdeep built a Python integration between the Jira REST API and the Anthropic Claude API to automate QA ticket analysis, and led an internal pilot exploring agentic AI for QA and network security workflows.',
  ],
  teaser:
    'Siya Labs is led by founder and CEO Rajdeep Sah, whose work spans AI research, software engineering, and quality engineering, including peer-reviewed research on generative AI and AI-driven QA automation in industry.',
  background: [
    {
      heading: 'Education',
      items: [
        { title: 'B.S. Computer Information Science', meta: 'Washburn University · Class of 2026' },
        { title: 'Minors in Mathematics and Statistics', meta: 'Washburn University' },
        { title: 'Cybersecurity Certificate', meta: 'Washburn University' },
      ],
    },
    {
      heading: 'Experience',
      items: [
        { title: 'Quality Engineering & AI Research Intern', meta: 'FireMon · 2026' },
        { title: 'Software Developer & AI Research Intern', meta: 'Nyalia’s Software Solutions · 2024–present' },
        { title: 'Computer Information Science and Mathematics Tutor', meta: 'Washburn University' },
      ],
    },
    {
      heading: 'Research and recognition',
      items: [
        {
          title: '“Generative AI in higher education: student and faculty perspectives on use, ethics, and impact”',
          meta: 'Co-author · Issues in Information Systems 26(2), 2025',
          href: 'https://doi.org/10.48009/2_iis_129',
        },
        { title: 'Best in Show', meta: 'CCSC Central Plains Student Hackathon · 2026' },
        { title: 'Top 4 of 21 teams', meta: 'CCSC Central Plains Programming Competition · 2025' },
      ],
    },
    {
      heading: 'Leadership',
      items: [
        { title: 'President, Club Mathematica', meta: 'Washburn University' },
        { title: 'President, ByteBods Computer Club', meta: 'Washburn University' },
      ],
    },
  ],
  expertise: [
    'Python',
    'TypeScript',
    'React & Next.js',
    'FastAPI',
    'Node.js',
    'LLM APIs & agentic workflows',
    'PyTest, Jest & Selenium',
    'SQL & NoSQL databases',
    'AWS',
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajdeepsah/' },
    { label: 'GitHub', href: 'https://github.com/RajdeepSah' },
    { label: 'Personal website', href: 'https://rajdeep.officialework.com' },
  ],
} as const;
