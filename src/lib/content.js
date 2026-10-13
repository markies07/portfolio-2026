// Centralized site content. Edit here — components stay presentation-only.

export const PERSON = {
  name: "MARK CHRISTIAN NAVAL",
  firstLine: "MARK CHRISTIAN NAVAL",
  secondLine: "",
  initials: "MCN",
  roles: "Full-Stack Web Developer — AI-Powered Workflow",
  intro:
    "I design and build websites and web apps that look great, load fast, and are easy for anyone to use — with AI built into my process so you get better results, sooner.",
  location: "Cavite, Philippines",
  email: "markchristiannaval07@gmail.com",
  year: "2026",
  availability: "Available for select projects",
  // Drop a photo in /public and set its path here (e.g. "/portrait.jpg").
  portrait: null,
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
    title: "AI-Powered Workflow",
    description:
      "AI is part of how I work every day. It helps me deliver faster, catch mistakes earlier, and add smart features to your project — while I stay in charge of the quality and the details.",
    highlights: ["Faster turnaround", "Fewer errors", "Smart features", "Automated routine tasks"],
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

export const PROJECTS = [
  {
    index: "01",
    title: "HomePaws",
    year: "2025",
    category: "Pet Adoption Platform",
    description:
      "A pet adoption website with a friendly community built in. People can browse pets looking for a home, post their own, get notified about new matches, and connect with other pet lovers — all in one place.",
    stack: ["React", "Firebase", "Tailwind CSS"],
    href: "https://github.com/markies07/HomePaws",
    cta: "View on GitHub",
  },
  {
    index: "02",
    title: "Clockin",
    year: "2026",
    category: "Attendance & Time Tracking",
    description:
      "An easy way for teams to track work hours. Employees clock in and out with a single tap, while managers see attendance and schedules at a glance on one simple dashboard.",
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
    href: "https://github.com/markies07/Clockin",
    cta: "View on GitHub",
    image: "/clockin-placeholder.jpg",
  },
  {
    index: "03",
    title: "Tomodachi",
    year: "2024",
    category: "Local Job Board",
    description:
      "A job board that connects people in Cavite with local employers. Job seekers can browse openings, see what each role needs, and apply online in just a few easy steps.",
    stack: ["React", "PHP", "MySQL"],
    href: "https://github.com/markies07/Tomodachi",
    cta: "View on GitHub",
  },
  {
    index: "04",
    title: "KIX",
    year: "2024",
    category: "Online Store Concept",
    description:
      "A sneaker shop concept designed to make browsing and buying shoes quicker and more enjoyable — planned and designed from scratch as a design case study.",
    stack: ["Figma", "React"],
    href: null,
    cta: "Design Concept",
  },
];

export const ABOUT = {
  statement:
    "I build websites and web apps that look great, work fast, and help your business grow.",
  paragraphs: [
    "Hi, I'm Mark — a full-stack web developer from Cavite, Philippines. Put simply, I take care of everything it takes to bring a website to life: the design you see, the buttons and features you click, and the behind-the-scenes system that keeps it all running smoothly.",
    "I've also made AI a natural part of how I work. It helps me move faster, spot problems earlier, and spend more time on what really matters — building something you'll be proud to share. On top of development, I do graphic design and video editing, so your brand looks polished everywhere it shows up.",
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
