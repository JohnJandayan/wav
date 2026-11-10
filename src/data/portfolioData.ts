export type SectionId =
  'home' | 'about' | 'skills' | 'education' | 'projects' | 'certificates' | 'contact';
export type Category = 'All' | 'Marketing & SEO' | 'Audio & Branding' | 'Operations';
export type PreviewKind = 'audio' | 'marketing' | 'operations' | 'copywriting';
export interface SectionInfo {
  id: SectionId;
  label: string;
  index: string;
  eyebrow: string;
  title: string;
}
export interface Project {
  id: string;
  number: string;
  title: string;
  category: Exclude<Category, 'All'>;
  type: string;
  role: string;
  scope: string;
  activities: string[];
  preview: PreviewKind;
}
export interface Credential {
  id: string;
  title: string;
  shortTitle: string;
  type: string;
  summary: string;
  image: string | null;
}

export const PROFILE_IMAGE_URL: string | null = null;
export const PROFILE_PIC_URL = PROFILE_IMAGE_URL;
export const CANVA_CERT_URL: string | null = null;
export const MUSIC_PORTFOLIO_URL: string | null = null;
export const AUDIO_REEL_URL: string | null = null;

interface PortfolioContract {
  sections: SectionInfo[];
  projects: Project[];
  credentials: Credential[];
  meta: { title: string; description: string };
}

export const portfolioData = {
  meta: {
    title: 'Thaddeus Campos — Marketing, Music & Culture',
    description:
      'Thaddeus Campos / zyun.wav: Marketing student, audio engineer and digital brand manager in Butuan City, Philippines. Explore work, capabilities and collaborations.',
  },
  identity: {
    name: 'Thaddeus Campos',
    artist: 'zyun.wav',
    initials: 'TC',
    email: 'bobitasstem@gmail.com',
    instagram: 'https://instagram.com/zyun.wav',
    handle: '@zyun.wav',
    location: 'Butuan City, Philippines',
    institution: 'FSUU',
    portraitAlt: 'Portrait of Thaddeus Campos',
    portraitLabel: 'The person behind the frequency',
    portraitMissing: 'Marketing mind. Producer’s ear.',
    portraitError: 'Portrait unavailable',
    roles: 'Marketing student / Audio engineer / Digital brand manager',
  },
  sections: [
    { id: 'home', label: 'Home', index: '01', eyebrow: 'Home Page', title: 'Home' },
    { id: 'about', label: 'About', index: '02', eyebrow: 'Personal dossier', title: 'About Me' },
    {
      id: 'skills',
      label: 'Skills',
      index: '03',
      eyebrow: 'Capability matrix',
      title: 'Skills & Competencies',
    },
    {
      id: 'education',
      label: 'Education',
      index: '04',
      eyebrow: 'Academic & milestone timeline',
      title: 'Education & Achievements',
    },
    {
      id: 'projects',
      label: 'Projects',
      index: '05',
      eyebrow: 'Selected works & field experience',
      title: 'Projects & Experiences',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      index: '06',
      eyebrow: 'Verified credentials',
      title: 'Certificates & Training',
    },
    {
      id: 'contact',
      label: 'Contact',
      index: '07',
      eyebrow: 'Initiate transmission',
      title: 'Contact Information',
    },
  ],
  nav: {
    collaborate: 'Let’s Collaborate',
    menu: 'Open navigation',
    closeMenu: 'Close navigation',
    label: 'Main navigation',
    skip: 'Skip to content',
    signature: 'Portfolio / 2026',
    homeLabel: 'Thaddeus Campos — home',
  },
  hero: {
    badge: 'All will be well.',
    lineOne: 'Marketing Strategy',
    lineTwo: 'at the',
    lineThree: 'Frequency of Culture.',
    intro:
      'Hi, I am Thaddeus Campos, a 1st-year Marketing student at Father Saturnino Urios University (FSUU), equipped with 6 years of audio engineering mastery, multi-artist digital brand management, and public-sector operations experience.',
    introShort: 'Building brands that resonate. Creating sound that stays.',
    explore: 'Explore my dossier',
    available: 'Open to meaningful collaborations',
    metricNote: 'Owner-reported experience & milestones',
    scroll: 'Scroll to tune in',
    dockLabel: 'Three disciplines. One connected perspective.',
    metrics: [
      {
        value: '6+ Yrs',
        label: 'Audio engineering & music production',
        note: 'Self-taught. Scene-tested.',
      },
      { value: '1,000+', label: 'Monthly Spotify listeners', note: 'Independent artist / 2026' },
      { value: 'DOA ’25', label: 'Inventory management intern', note: 'Department of Agriculture' },
      {
        value: 'Multi-Artist',
        label: 'Social media & brand roster',
        note: 'Strategy meets storytelling.',
      },
    ],
  },
  about: {
    headline: 'A marketing mind.\nA producer’s ear.',
    paragraphs: [
      'I work where creative instinct meets technical discipline. Based in Butuan City, Philippines, I bring the same attention to a brand’s story that I bring to a mix: listen first, find what matters, then make every element work together.',
      'After spending a year at Mapúa Malayan Colleges Mindanao, I transferred to Father Saturnino Urios University to focus on Marketing. My path connects six years of self-taught audio engineering with multi-artist digital brand management and public-sector operations experience.',
    ],
    philosophyLabel: 'A personal operating principle',
    philosophy: '“All will be well.”',
    philosophyText:
      'Composure under pressure. Precision in the details. Adaptability in the process. Whether I’m balancing a mix, organizing inventory, or shaping a campaign, I believe thoughtful work makes room for good outcomes.',
    aspirationsLabel: 'The direction I’m building toward',
    aspirations:
      'Scaling independent artists and modern brands through full-funnel digital marketing, SEO copywriting, sonic branding, and e-commerce conversion systems.',
    values: ['Listen with intent', 'Work with precision', 'Adapt with purpose'],
    caption: 'Creative instinct, grounded in a system.',
  },
  skills: {
    intro:
      'Different tools. The same intention: make the message clear, the process considered, and the experience memorable.',
    explore: 'Explore capabilities',
    domains: [
      {
        id: 'digital',
        number: '01',
        title: 'Digital Marketing\n& E-Commerce',
        detail: 'From discovery to the decision.',
        accent: 'green',
        skills: [
          'Social Media Management (Multi-Artist Roster)',
          'SEO & E-Commerce Copywriting',
          'Digital Branding',
          'Audience Growth Analytics',
          'Canva Visual Design',
        ],
      },
      {
        id: 'audio',
        number: '02',
        title: 'Technical &\nAudio Engineering',
        detail: 'An identity you can hear.',
        accent: 'warm',
        skills: [
          '6+ Years Self-Taught Audio Engineering',
          'Mixing & Mastering',
          'Music Production (zyun.wav)',
          'DAW Proficiency',
          'Sonic Identity Design',
        ],
      },
      {
        id: 'operations',
        number: '03',
        title: 'Business\n& Operations',
        detail: 'Creative ambition needs structure.',
        accent: 'neutral',
        skills: [
          'Inventory Management Systems',
          'Supply Chain & Stock Auditing (Dept. of Agriculture Experience)',
          'Project Coordination',
        ],
      },
      {
        id: 'communication',
        number: '04',
        title: 'Communication\n& Interpersonal',
        detail: 'Good work starts with listening.',
        accent: 'neutral',
        skills: [
          'High-Impact Client & Artist Collaboration',
          'Cross-Functional Team Communication',
          'Public Relations',
          'Creative Direction',
        ],
      },
    ],
  },
  education: {
    intro: 'A foundation shaped by classrooms, collaboration, and hands-on experience.',
    timeline: [
      {
        id: 'fsuu',
        date: '2025 – Present',
        title: 'Father Saturnino Urios University',
        abbreviation: 'FSUU',
        qualification:
          'Bachelor of Science in Business Administration Major in Marketing Management (1st Year)',
        description: 'Focusing on e-commerce, digital branding, and consumer behavior.',
        current: true,
      },
      {
        id: 'mmcm',
        date: '2024 – 2025',
        title: 'Mapúa Malayan Colleges Mindanao',
        abbreviation: 'MMCM',
        qualification: 'Completed 1st Year College Tenure',
        description:
          'Built strong technical and analytical foundations before transferring to FSUU.',
        current: false,
      },
      {
        id: 'senior',
        date: '2023 – 2025',
        title: 'Timber City Academy',
        abbreviation: 'TCA',
        qualification: 'Senior High School Diploma — Graduated 2025',
        description: 'Butuan City, Philippines.',
        current: false,
      },
      {
        id: 'junior',
        date: '2019 – 2023',
        title: 'Timber City Academy',
        abbreviation: 'TCA',
        qualification: 'Junior High School Diploma — Graduated 2023',
        description: 'Butuan City, Philippines.',
        current: false,
      },
    ],
    milestoneLabel: 'Beyond the classroom',
    achievements: [
      {
        marker: '1,000+',
        title: 'Spotify listeners milestone',
        date: '2026',
        description:
          'Achieved organic streaming traction as an independent artist and producer, zyun.wav.',
      },
      {
        marker: 'Local scene',
        title: 'Producer & collaborator',
        date: 'Butuan City',
        description:
          'Engineered and collaborated with multiple rising artists across the Butuan City music scene.',
      },
      {
        marker: 'DOA ’25',
        title: 'Government operations internship',
        date: '2025',
        description: 'Selected as Inventory Manager Intern at the Department of Agriculture.',
      },
    ],
  },
  projects: [
    {
      id: 'artist-roster',
      number: '01',
      title: 'Artist Roster Social Media & Digital Brand Management',
      category: 'Marketing & SEO',
      type: 'Professional / Marketing output',
      role: 'Social Media Manager & Digital Strategist',
      scope:
        'Managing multiple artist social media accounts, content calendars, release rollouts, and audience engagement funnels.',
      activities: [
        'Content calendars & release strategy',
        'Digital identity & artist positioning',
        'Audience engagement funnels',
      ],
      preview: 'marketing',
    },
    {
      id: 'zyun',
      number: '02',
      title: 'zyun.wav Music Production Portfolio & Sonic Branding',
      category: 'Audio & Branding',
      type: 'Creative / Professional output',
      role: 'Lead Audio Engineer & Producer (6 Years Experience)',
      scope:
        'Reached 1,000+ listeners on Spotify in 2026; produced, mixed, and mastered tracks for local Butuan City artists.',
      activities: [
        'Music production, mixing & mastering',
        'Sonic identity & local artist collaboration',
        'Independent artist development',
      ],
      preview: 'audio',
    },
    {
      id: 'agriculture',
      number: '03',
      title: 'Department of Agriculture Inventory Management System',
      category: 'Operations',
      type: 'Professional experience / 2025',
      role: 'Inventory Manager Intern',
      scope:
        'Managed stock tracking, resource allocation, and audit reporting for regional agricultural supplies, demonstrating high organizational accuracy.',
      activities: [
        'Stock tracking & inventory organization',
        'Resource allocation',
        'Audit reporting & documentation',
      ],
      preview: 'operations',
    },
    {
      id: 'search-to-sale',
      number: '04',
      title: 'E-Commerce & SEO Copywriting Case Study',
      category: 'Marketing & SEO',
      type: 'Academic output / FSUU',
      role: 'Marketing Student (FSUU)',
      scope:
        'Applied search-to-sale copywriting frameworks, keyword optimization, and digital branding principles from recent marketing seminars.',
      activities: [
        'Search intent & keyword optimization',
        'Product storytelling & conversion copy',
        'Digital branding principles',
      ],
      preview: 'copywriting',
    },
  ],
  work: {
    headline: 'Work that finds\nits frequency.',
    intro:
      'A selection of owner-described academic and professional outputs. Each brings a different discipline to the same goal: meaningful connection.',
    filters: ['All', 'Marketing & SEO', 'Audio & Branding', 'Operations'] as Category[],
    filterLabel: 'Filter selected works',
    resultLabel: 'outputs shown',
    scopeLabel: 'The scope',
    roleLabel: 'My role',
    outputLabel: 'Output',
    details: 'Inside the work',
    evidence:
      'Work summaries provided by Thaddeus. Source artifacts and supporting links are not yet attached.',
    musicCta: 'Launch Music Portfolio',
    musicFallback: 'Connect with zyun.wav',
    musicMissing:
      'Full music portfolio link is not yet attached. Connect through the artist profile.',
  },
  previews: {
    audio: {
      label: 'Audio engineering & Spotify',
      title: 'Sound with a signature.',
      artist: 'zyun.wav',
      descriptor: 'Mixing / Mastering / Sonic identity',
      signal: 'Visual signal demo',
      reel: 'Audio reel',
      waveformLabel: 'Decorative waveform — not recording analysis',
    },
    marketing: {
      label: 'Digital marketing & SEO strategy',
      title: 'Make the story travel.',
      demo: 'Illustrative campaign curve',
      disclaimer: 'Concept preview — not campaign results',
      axis: 'Relative reach index',
      series: 'Relative reach',
      table: 'View sample data',
      pointLabel: 'Phase',
      points: [
        { label: 'Discover', value: 12 },
        { label: 'Connect', value: 28 },
        { label: 'Engage', value: 24 },
        { label: 'Release', value: 58 },
        { label: 'Amplify', value: 72 },
        { label: 'Retain', value: 88 },
      ],
    },
    operations: {
      label: 'Operations & inventory systems',
      title: 'Precision behind the scenes.',
      stamp: 'Department of Agriculture / 2025',
      disclaimer: 'Workflow preview — no government records',
      steps: ['Track stock', 'Allocate resources', 'Document & audit'],
      state: 'Process',
      header: 'Inventory workflow',
    },
    copywriting: {
      label: 'Search-to-sale framework',
      title: 'From intent to action.',
      stages: [
        { word: 'Search', detail: 'Understand the intent' },
        { word: 'Story', detail: 'Clarify the value' },
        { word: 'Sale', detail: 'Make the next step clear' },
      ],
      disclaimer: 'Academic framework preview',
    },
    explore: 'Explore this discipline',
  },
  credentials: [
    {
      id: 'canva',
      title: 'Canva Design School Certification',
      shortTitle: 'Canva Design School',
      type: 'Digital design credential',
      summary:
        'Verified Digital Design Credential (owner-reported). Visual communication and digital design.',
      image: CANVA_CERT_URL,
    },
    {
      id: 'click-grow',
      title: 'CLICK & GROW: Build Your Digital Presence Through Social Media Management',
      shortTitle: 'CLICK & GROW',
      type: 'Seminar & workshop completion',
      summary: 'Focused on content pillars, platform algorithms, and brand growth.',
      image: null,
    },
    {
      id: 'search-sale',
      title: 'Search to Sale: Mastering SEO and E-Commerce Copywriting',
      shortTitle: 'Search to Sale',
      type: 'Seminar & workshop completion',
      summary: 'Focused on search intent, product copywriting, and conversion optimization.',
      image: null,
    },
    {
      id: 'professional',
      title: 'THE DEVELOPING PROFESSIONAL: Digital Branding and Effective Online Portfolio',
      shortTitle: 'The Developing Professional',
      type: 'Seminar & workshop completion',
      summary: 'Focused on personal equity, professional positioning, and digital architecture.',
      image: null,
    },
  ],
  vault: {
    intro:
      'Learning that supports the work. Design, digital presence, search strategy, and professional positioning.',
    view: 'View Certificate',
    preview: 'Preview credential',
    close: 'Close preview',
    missingTitle: 'Certificate image not yet supplied',
    missing:
      'This credential is listed from owner-provided information. Its original document has not been attached for viewing or independent verification.',
    failed: 'This certificate image could not be loaded.',
    provenance: 'Owner-reported credentials. Original documents are shown when supplied.',
    document: 'Credential dossier',
    imageAlt: 'Certificate document for',
    loading: 'Loading certificate image',
  },
  contact: {
    headline: 'Let’s make\nsomething resonate.',
    intro:
      'A brand to build. A record to shape. A new opportunity to explore. I’m ready to listen.',
    availability:
      'Available for remote marketing, social media management, and audio engineering collaborations.',
    emailLabel: 'Direct line',
    socialLabel: 'Artist channel',
    locationLabel: 'Based in',
    copy: 'Copy Email',
    copied: 'Email copied',
    copyFailed: 'Copy unavailable. Select the email address or open your email app.',
    formTitle: 'Start a conversation',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Tell me a little about what you have in mind…',
    subjects: ['Marketing & SEO', 'Audio Engineering / Collab', 'Internship / Career Opportunity'],
    submit: 'Open email draft',
    hint: 'Opens your email app with a prepared draft. You send it there; this website does not send or store your message.',
    draftReady:
      'Your draft is ready. Send it from your email app. Nothing has been sent by this website.',
    longDraft:
      'Your message is ready below. Copy it into your email app; it is too long for a reliable email link.',
    fallbackLabel: 'Email draft fallback',
    fallbackHint:
      'No email app opened? Copy or select this draft and send it to the address above.',
    copyDraft: 'Copy draft',
    draftCopied: 'Draft copied',
    draftCopyFailed: 'Copy unavailable. Select the draft text below.',
    draftIntro: 'Portfolio inquiry from',
    errors: {
      name: 'Enter your name (up to 100 characters).',
      email: 'Enter a valid email address (up to 254 characters).',
      subject: 'Choose one of the listed subjects.',
      message: 'Enter a message (up to 5,000 characters).',
    },
  },
  footer: {
    note: 'Culture in the strategy. Intention in the sound.',
    copyright: '© 2026 Thaddeus Campos',
    back: 'Back to the top',
    academicToggle: 'Academic Submission Info',
    academic: [
      { label: 'Subject', value: 'E-Commerce and Internet Marketing' },
      { label: 'Student', value: 'Thaddeus Campos' },
      { label: 'Institution', value: 'FSUU' },
      { label: 'Platform', value: 'Custom React + TypeScript Architecture on Cloudflare Pages' },
    ],
  },
  ui: {
    close: 'Close',
    loading: 'Loading',
    pauseMotion: 'Pause motion',
    resumeMotion: 'Resume motion',
    motionReduced: 'Reduced motion enabled',
    expand: 'Expand',
    collapse: 'Collapse',
  },
  audio: {
    startDemo: 'Start visual demo',
    pauseDemo: 'Pause visual demo',
    play: 'Play audio reel',
    pause: 'Pause audio reel',
    demoNote: 'Silent visual demonstration. Audio reel not yet supplied.',
    failed: 'Audio could not be played. Try again or contact the artist.',
    loading: 'Loading audio reel',
    running: 'Signal in motion',
    idle: 'Tune into the work',
    ended: 'Audio reel ended',
  },
} satisfies PortfolioContract & Record<string, unknown>;

export const getSection = (id: SectionId): SectionInfo => {
  const section = portfolioData.sections.find((item) => item.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
};
