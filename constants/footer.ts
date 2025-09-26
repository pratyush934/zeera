// Types for footer data structure
export interface FooterLink {
  name: string;
  href: string;
  icon: string; // Icon name as string, will be mapped to actual icon in component
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string; // Icon name as string
}

// Footer sections configuration
export const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      {
        name: "Features",
        href: "/features",
        icon: "Zap",
      },
      {
        name: "Pricing",
        href: "/pricing",
        icon: "BarChart3",
      },
      {
        name: "Templates",
        href: "/templates",
        icon: "FileText",
      },
      {
        name: "Integrations",
        href: "/integrations",
        icon: "Settings",
      },
      {
        name: "Roadmap",
        href: "/roadmap",
        icon: "Calendar",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        name: "Documentation",
        href: "/docs",
        icon: "FileText",
      },
      {
        name: "Help Center",
        href: "/help",
        icon: "HelpCircle",
      },
      {
        name: "Community",
        href: "/community",
        icon: "Users",
      },
      { 
        name: "Blog", 
        href: "/blog", 
        icon: "Globe",
      },
      {
        name: "API Reference",
        href: "/api",
        icon: "Settings",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { 
        name: "About", 
        href: "/about", 
        icon: "Users",
      },
      {
        name: "Careers",
        href: "/careers",
        icon: "Users",
      },
      {
        name: "Contact",
        href: "/contact",
        icon: "Mail",
      },
      { 
        name: "Press", 
        href: "/press", 
        icon: "Globe",
      },
      {
        name: "Partners",
        href: "/partners",
        icon: "Users",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Help Desk",
        href: "/support",
        icon: "MessageSquare",
      },
      {
        name: "Status",
        href: "/status",
        icon: "Shield",
      },
      {
        name: "Security",
        href: "/security",
        icon: "Shield",
      },
      {
        name: "Contact Sales",
        href: "/sales",
        icon: "Mail",
      },
      {
        name: "Enterprise",
        href: "/enterprise",
        icon: "Users",
      },
    ],
  },
];

// Social media links configuration
export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/pratyush934",
    icon: "Github",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/@Pratyush934",
    icon: "Twitter",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: "Linkedin",
  },
  {
    name: "Email",
    href: "mailto:hello@zeera.app",
    icon: "Mail",
  },
];

// Brand information
export const brandInfo = {
  name: "Zeera",
  description: "Modern project management platform that helps teams stay organized, collaborate effectively, and deliver results faster.",
  logo: "Z",
  status: "Beta",
};

// Legal links
export const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Sitemap", href: "/sitemap" },
];

// Footer configuration
export const footerConfig = {
  showNewsletter: true,
  showScrollToTop: true,
  showMobileMessage: true,
  mobileMessage: "Made with ❤️ for teams",
  copyrightText: "All rights reserved.",
};

// Icon mapping for easier maintenance
export const iconMap = {
  Zap: "Zap",
  BarChart3: "BarChart3", 
  FileText: "FileText",
  Settings: "Settings",
  Calendar: "Calendar",
  HelpCircle: "HelpCircle",
  Users: "Users",
  Globe: "Globe",
  Mail: "Mail",
  MessageSquare: "MessageSquare",
  Shield: "Shield",
  Github: "Github",
  Twitter: "Twitter",
  Linkedin: "Linkedin",
} as const;