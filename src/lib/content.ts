import type { PublicJob, PublicMoment, PublicPost, PublicVoice, WorkSetup } from "@/types/content";

export const site = {
  name: "Voigue",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://voigue.lk",
  website: "www.voigue.com",
  brandLine: "Bridging people and possibilities across borders.",
  description:
    "Voigue is the talent-facing home of Voigue (Pvt) Ltd: see life and work at Voigue, explore current vacancies and apply for international careers from Sri Lanka.",
  emails: {
    general: "hello@voigue.com",
    careers: "careers@voigue.com"
  },
  phones: {
    sriLanka: "011 711 0170",
    australia: "1300 095 588"
  },
  locations: {
    australia: {
      country: "Australia",
      city: "Melbourne",
      address: "Ground floor, 470 St Kilda Road, Melbourne, VIC 3004, Australia",
      mapQuery: "470 St Kilda Road, Melbourne, VIC 3004, Australia"
    },
    sriLanka: {
      country: "Sri Lanka",
      city: "Colombo",
      address: "No. 736 (4th floor), Bank Building, Dr Danister De Silva Mw, Orion City, Colombo 09",
      mapQuery: "Orion City, Dr Danister De Silva Mawatha, Colombo 09, Sri Lanka"
    }
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/voigue/" },
    { label: "Instagram", href: "https://www.instagram.com/voigue365?igsi=dDN4NGdtZm5semQ0" },
    { label: "Facebook", href: "https://www.facebook.com/share/14nRE1USJ8Q/?mibextid=wwXIfr" },
    { label: "TikTok", href: "https://www.tiktok.com/@voigueptyltd?_r=1&_t=ZS-99TKd3EV1eB" }
  ]
};

export const openRolesHref = "/careers#current-openings";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Life at Voigue", href: "/life-at-voigue" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" }
];

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Life at Voigue", href: "/life-at-voigue" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" }
];

export const workSetups: { label: WorkSetup; dot: string }[] = [
  { label: "Remote", dot: "bg-brand-violet" },
  { label: "Hybrid", dot: "bg-amber-400" },
  { label: "On-site", dot: "bg-sky-500" }
];

export const setupDot = (setup?: string) => workSetups.find((item) => item.label === setup)?.dot ?? "bg-line";

/* ---------- Placeholder content (replaced by CMS data when MongoDB has entries) ---------- */

export const fallbackJobs: PublicJob[] = [
  {
    title: "Social Media Executive",
    slug: "social-media-executive",
    summary: "Create and manage engaging content that helps grow our brand across social platforms.",
    workSetup: "Remote",
    department: "Marketing",
    location: "Sri Lanka",
    employmentType: "Full-time",
    description:
      "As a Social Media Executive at Voigue, you'll be responsible for creating engaging content, supporting campaigns and helping grow our brand across multiple platforms. You'll work closely with the marketing team to ensure our message connects with our audience and reflects who we are.",
    responsibilities: [
      "Plan, create and schedule content across social media platforms",
      "Support brand and campaign initiatives",
      "Monitor performance and report on engagement",
      "Stay on top of trends and bring fresh ideas to the team"
    ],
    requirements: [
      "Previous experience in social media or content creation",
      "A good eye for design, tone and detail",
      "Strong written English",
      "A proactive, creative mindset"
    ],
    status: "Active",
    featured: true
  },
  {
    title: "Client Success Manager",
    slug: "client-success-manager",
    summary: "Be the main point of contact for our clients, supporting day-to-day operations and long-term partnerships.",
    workSetup: "Hybrid",
    department: "Client Services",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    description:
      "You'll be the main point of contact for our Australian clients, making sure the people we place are supported and the partnership keeps growing. This is a hybrid role split between home and our Colombo office.",
    responsibilities: [
      "Own day-to-day communication with assigned clients",
      "Identify and resolve issues before they grow",
      "Run regular check-ins with clients and placed talent",
      "Work with recruitment to plan upcoming needs"
    ],
    requirements: [
      "Experience in account management, customer success or a similar role",
      "Confident communicator, comfortable with international clients",
      "Organised, calm under pressure and genuinely people-focused"
    ],
    status: "Active"
  },
  {
    title: "Talent Acquisition Executive",
    slug: "talent-acquisition-executive",
    summary: "Source, screen and shortlist talent to help us find the right fit for our clients.",
    workSetup: "On-site",
    department: "Talent Acquisition",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    description:
      "Join our Talent Acquisition team and help match great people with the businesses that need them. You'll handle the journey from first call to shortlisted profile, working side by side with the team in our Colombo office.",
    responsibilities: [
      "Source and screen candidates for client roles",
      "Run initial screening calls and internal interviews",
      "Prepare and present shortlists to clients",
      "Keep candidates informed and supported throughout"
    ],
    requirements: [
      "Recruitment or HR experience is an advantage",
      "Excellent interpersonal and communication skills",
      "Good judgement when assessing skills and fit"
    ],
    status: "Active"
  },
  {
    title: "Graphic Designer",
    slug: "graphic-designer",
    summary: "Bring ideas to life through clean, on-brand design across digital and print.",
    workSetup: "Remote",
    department: "Marketing",
    location: "Sri Lanka",
    employmentType: "Full-time",
    description:
      "Create design that looks and feels like Voigue, from social content and campaign assets to documents and presentations. You'll work with a close team of marketers and video creators.",
    responsibilities: [
      "Design assets for digital, social and print",
      "Maintain brand consistency across all materials",
      "Collaborate with marketing and video teams"
    ],
    requirements: [
      "Portfolio demonstrating strong visual design",
      "Proficiency in Adobe Creative Suite or Figma",
      "Attention to detail and a love of typography"
    ],
    status: "Active"
  },
  {
    title: "Video Editor",
    slug: "video-editor",
    summary: "Edit and produce video content for campaigns, social media and internal projects.",
    workSetup: "Hybrid",
    department: "Marketing",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    description:
      "Shape the stories we tell about Voigue and our clients: short-form social video, event recaps, campaign pieces and internal content.",
    responsibilities: [
      "Edit and produce video for campaigns and social channels",
      "Add motion graphics, sound and colour where needed",
      "Manage a content pipeline with multiple deadlines"
    ],
    requirements: [
      "Experience with Premiere Pro, After Effects or similar",
      "A strong eye for pacing and storytelling",
      "A portfolio of previous work"
    ],
    status: "Active"
  },
  {
    title: "Project Coordinator",
    slug: "project-coordinator",
    summary: "Support project delivery and keep workflows on track across teams.",
    workSetup: "On-site",
    department: "Operations",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    description:
      "Keep projects moving. You'll coordinate across teams, track progress and make sure nothing falls through the cracks, working in person at our Colombo office.",
    responsibilities: [
      "Coordinate tasks, timelines and deliverables",
      "Report on progress and flag risks early",
      "Support teams with documentation and follow-ups"
    ],
    requirements: [
      "Experience coordinating projects or operations",
      "Strong organisation and communication",
      "Comfortable working across several teams at once"
    ],
    status: "Active"
  }
];

export const fallbackVoices: PublicVoice[] = Array.from({ length: 5 }, () => ({
  name: "Employee name",
  role: "Role title",
  quote: "A short testimonial from a Voigue team member will appear here once approved copy and photos are supplied."
}));

export const momentCategories = ["All Moments", "Parties", "Events", "Community"] as const;

export const fallbackMoments: PublicMoment[] = [
  { title: "Team celebration", category: "Parties" },
  { title: "Community day", category: "Community" },
  { title: "Annual event", category: "Events" },
  { title: "Year-end party", category: "Parties" },
  { title: "Giving back", category: "Community" },
  { title: "Company offsite", category: "Events" },
  { title: "Festive get-together", category: "Parties" },
  { title: "Volunteer day", category: "Community" }
];

export const fallbackPosts: PublicPost[] = [
  {
    title: "How Managed Staffing Changes the Outsourcing Conversation",
    slug: "managed-staffing-outsourcing",
    excerpt: "Why businesses are moving from transactional offshore hiring to supervised, accountable global teams.",
    category: "Outsourcing",
    author: "Voigue",
    published: true,
    publishedAt: new Date().toISOString(),
    tags: ["Managed Staffing", "BPO"],
    content:
      "Managed staffing works best when talent, supervision, infrastructure and accountability are designed as one operating model. This placeholder article should be replaced with client-approved editorial content."
  },
  {
    title: "Building Better Cross-Border Teams",
    slug: "cross-border-teams",
    excerpt: "Practical operating principles for teams working across Australia and Sri Lanka.",
    category: "People",
    author: "Voigue",
    published: true,
    publishedAt: new Date().toISOString(),
    tags: ["Teams", "Operations"],
    content:
      "Clear expectations, communication rhythms and manager visibility are essential for cross-border team performance. This is starter CMS content for review."
  }
];
