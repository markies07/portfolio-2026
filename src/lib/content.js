// Centralized site content. Edit here — components stay presentation-only.

export const PERSON = {
  name: "MARK CHRISTIAN NAVAL",
  firstLine: "MARK CHRISTIAN NAVAL",
  secondLine: "",
  initials: "MCN",
  roles: "Full-Stack Web Developer — AI Prompt Engineer",
  intro:
    "I design and develop fast, dependable websites and web applications that turn visitors into customers — taking every project from first concept to launch, with AI expertise that gets you there sooner.",
  location: "Cavite, Philippines",
  email: "markchristiannaval07@gmail.com",
  year: "2026",
  availability: "Available for select projects",
  // Background-removed cut-out (transparent PNG) — the hero stands it in
  // front of the name. The untouched original is /images/Mark.png.
  portrait: "/images/mark-cutout.png",
};

// Pre-filled draft when someone clicks your email address (opens Gmail).
export const EMAIL_TEMPLATE = {
  subject: "Project inquiry from your portfolio",
  body: [
    "Hi Mark,",
    "",
    "I came across your portfolio and I'd like to talk about a project.",
    "",
    "Name:",
    "Company / brand (optional):",
    "What I need:",
    "Timeline:",
    "Budget (optional):",
    "",
    "Thanks!",
  ].join("\n"),
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/markies07" },
  { label: "Facebook", href: "https://www.facebook.com/mark.naval07/" },
  { label: "Email", href: "mailto:markchristiannaval07@gmail.com" },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    index: "01",
    title: "Full-Stack Web Development",
    description:
      "I build complete websites and web apps from start to finish — the part your visitors see and the behind-the-scenes engine that keeps everything running. You get one finished product that simply works.",
    highlights: ["Business websites", "Custom web apps", "Online stores", "Admin dashboards"],
  },
  {
    index: "02",
    title: "AI Prompt Engineering",
    description:
      "As an AI prompt engineer with hands-on experience across a range of AI models, I know how to get accurate, consistent results from them. I design and test prompts that hold up in real use — and build them into your product as practical features, or into your workflow to take repetitive work off your plate.",
    highlights: ["Prompt design & testing", "Experience across AI models", "AI-powered features", "Workflow automation"],
  },
  {
    index: "03",
    title: "Responsive Websites",
    description:
      "Websites that look sharp and feel smooth on every screen — phone, tablet, or desktop. Quick to load, easy to find your way around, and designed to keep visitors interested.",
    highlights: ["Mobile-friendly", "Fast loading", "Easy to navigate", "Works for everyone"],
  },
  {
    index: "04",
    title: "Accounts, Data & Security",
    description:
      "Everything that happens behind the scenes: sign-ups and logins, saving and organizing your information, and keeping it all safe and reliable as your business grows.",
    highlights: ["User accounts", "Secure logins", "Organized data", "Ready to grow"],
  },
  {
    index: "05",
    title: "UI/UX Design",
    description:
      "Clean, easy-to-understand designs that make it obvious what to do next. I plan every page around your visitors, so they find what they need without having to think twice.",
    highlights: ["Page layouts", "Clickable prototypes", "Consistent branding", "Simple user journeys"],
  },
  {
    index: "06",
    title: "Graphic Design & Video Editing",
    description:
      "Eye-catching graphics and polished videos for your brand — from logos and social media posts to promotional clips — so everything you share looks professional and on-brand.",
    highlights: ["Logos & branding", "Social media graphics", "Promo videos", "Video editing"],
  },
];

// The Work section shows `description` (short) on each card. `details` is
// the full write-up for each project's own page (not built yet), along with
// `links.live` for its "Visit website" button.
export const PROJECTS = [
  {
    slug: "homepaws",
    index: "01",
    title: "HomePaws",
    year: "2025",
    category: "Pet Adoption & Rehoming Platform",
    description:
      "A pet rehoming platform for General Trias, Cavite — owners list pets, adopters apply, and every adoption is tracked from meet-up to signed contract.",
    stack: ["React", "Firebase", "Redux", "Tailwind CSS"],
    image: "/projects/homepaws.jpg",
    links: {
      live: "https://paws-ae1eb.web.app",
      repo: "https://github.com/markies07/HomePaws",
    },
    details: {
      overview:
        "HomePaws is my capstone project: an online rehoming information system that helps pets in General Trias, Cavite find safe new homes. Instead of scattered social media posts, owners and adopters get one trusted place to list pets, apply, talk, and complete an adoption — with an admin team keeping the community safe.",
      features: [
        "Pet listings — owners post dogs and cats for adoption; adopters browse, filter, and save favorites.",
        "Adoption applications — a structured application form, with owners reviewing, accepting, or rejecting each request and every application tracked as active, accepted, rejected, closed, or rehomed.",
        "Meet-up scheduling — owners and adopters agree on a date, time, and place, shown on an OpenStreetMap map.",
        "Adoption contracts — an auto-generated, downloadable PDF agreement between owner and adopter.",
        "Post-adoption follow-ups — scheduled follow-up reminders after each adoption to check on the pet's welfare.",
        "Community — a news feed with likes and comments, real-time chat, and in-app notifications.",
        "Identity verification — users submit a valid ID for admin review, so adopters and owners are verified.",
        "Admin tools — user management (verify, ban, deactivate, assign admins), pet and report moderation, and adoption statistics per barangay with exportable PDF reports.",
      ],
      stack: ["React", "Vite", "Firebase (Auth, Firestore, Storage, Hosting)", "Redux Toolkit", "Tailwind CSS", "React Leaflet / OpenStreetMap", "Chart.js", "jsPDF"],
    },
  },
  {
    slug: "homehub",
    index: "02",
    title: "HomeHub",
    year: "2026",
    category: "Property Management System",
    description:
      "An apartment management platform for owners, staff, and tenants — with digital rent payments, lease tracking, cash-flow analytics, and real-time chat.",
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
    image: "/projects/homehub.jpg",
    links: {
      live: "https://home-hub2026.vercel.app",
      repo: "https://github.com/markies07/HomeHub2026",
    },
    details: {
      overview:
        "HomeHub is a full rental and property management platform for apartment owners, property staff, and residents in Cavite. It rebuilds a traditional PHP/MySQL property system as a modern, real-time cloud app — one place to list units, manage tenants, collect rent, and stay in touch.",
      features: [
        "Public unit directory — a featured residence showcase, photo galleries, and filtering by availability, price, and room setup, with direct rental inquiries.",
        "Owner dashboard — gross earnings, monthly collections, and a 12-month cash-flow chart comparing income, expenses, and net profit.",
        "Units and tenants — unit status (available, occupied, under maintenance), photo management, tenant onboarding, deposits, lease periods, and contract termination.",
        "Payments and receipts — a filterable ledger across GCash, Maya, bank transfer, and cash, with automatically generated digital receipts.",
        "Tenant portal — rent due and balance tracking, online rent submission, a receipt history, the digital lease, and a stay-duration counter.",
        "Role-based access — separate portals and permissions for the owner, staff, and tenants.",
        "Real-time messaging — chat channels between management and each unit, with unread badges.",
        "Polished, responsive UI — smooth Framer Motion transitions, with dedicated mobile navigation.",
      ],
      stack: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Firebase Firestore", "Tailwind CSS v4", "Framer Motion", "date-fns"],
    },
  },
  {
    slug: "clockin",
    index: "03",
    title: "ClockIn",
    year: "2026",
    category: "Attendance & Payroll Tracker",
    description:
      "A personal time and pay tracker that turns every clock-in into accurate earnings — handling lates, overtime, holidays, and payroll cutoffs automatically.",
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
    image: "/projects/clockin.png",
    links: {
      live: "https://clockin-bymark.vercel.app",
      repo: "https://github.com/markies07/Clockin",
    },
    details: {
      overview:
        "ClockIn is a personal attendance and earnings tracker for anyone paid by the day or by the hour. Clock in and out with one tap, and it works out exactly what you've earned — applying your schedule, overtime rules, holidays, and payroll cutoffs for you.",
      features: [
        "One-tap time in and out — a live dashboard with today's status, key stats, an attendance calendar, and recent activity.",
        "Automatic pay computation — daily or hourly rates, late and undertime detection, late deductions, and automatic lunch-break handling.",
        "Overtime your way — paid overtime with a configurable multiplier and threshold, or banked as offset hours to use later.",
        "Rest days and holidays — rest-day overtime detected automatically, and holiday pay multipliers applied.",
        "Payroll — semi-monthly or custom cutoffs and paydays, pay slips showing gross pay, deductions, and net pay, and periods marked as paid.",
        "Reports — weekly hours, monthly summaries, a salary breakdown, attendance streaks, and CSV export.",
        "Built for daily use — fixed or flexible schedules, Google sign-in, dark mode, a privacy toggle that hides amounts, and a mobile-first layout.",
      ],
      stack: ["Next.js", "React", "TypeScript", "Firebase (Auth, Firestore)", "Tailwind CSS", "shadcn/ui", "Recharts", "date-fns"],
    },
  },
  {
    slug: "dubai-parking",
    index: "04",
    title: "Dubai Parking",
    year: "2026",
    category: "Parking Management System",
    description:
      "A real-time parking system for a Dubai car park — drivers check free bays before they set off, while attendants and the owner run the lot from a staff portal.",
    // Written from the live site; the repo is private. Only Next.js is
    // confirmed — add the rest of the stack here.
    stack: ["Next.js"],
    image: "/projects/dubaiparking.jpg",
    links: {
      live: "https://aims-bycreservices.vercel.app",
      repo: null, // private
    },
    details: {
      overview:
        "Dubai Parking is a real-time parking system for a car park in Dubai. Drivers can see exactly how many bays are free before they set off, with clear rates and directions, while parking attendants and the owner manage the facility from a secure staff portal.",
      features: [
        "Live availability — free, taken, reserved, and out-of-service counts that update as vehicles arrive and leave.",
        "Interactive facility map — a level-by-level, zone-by-zone layout showing the status of every car and motorcycle bay.",
        "Busy-hours guide — typical occupancy by hour, so drivers can plan when to come.",
        "Transparent pricing — separate car and motorcycle rates with a free grace period, hourly rounding, and a daily maximum.",
        "Itemized receipts — every receipt shows the full fee calculation.",
        "Reserved bays — spaces can be held for a driver who's on the way.",
        "Location and directions — address, opening hours, and one-tap Google Maps directions.",
        "Staff portal — a secure sign-in for parking attendants and the owner.",
      ],
      stack: ["Next.js", "Vercel"],
    },
  },
];

export const ABOUT = {
  statement:
    "I build fast, sharp websites that grow your business.",
  paragraphs: [
    "I'm Mark, a full-stack web developer from Cavite, Philippines. I handle every layer — design, features, and the systems behind them — from planning to launch.",
    "As an AI prompt engineer experienced with a range of AI models, I deliver faster and build smarter features. I also offer graphic design and video editing.",
  ],
  facts: [
    { label: "Based in", value: "Cavite, Philippines" },
    { label: "What I do", value: "Websites, Web Apps, Design & Video" },
    { label: "Currently", value: "Open to new projects" },
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Mark took a complex requirement and delivered an intelligent full-stack solution with incredible speed — the AI-assisted workflows and technical execution were top tier.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote:
      "What stood out was how seamlessly he integrated backend architecture with modern frontend design and AI tooling. Exceptional developer.",
    name: "Client Name",
    role: "Role, Company",
  },
];
