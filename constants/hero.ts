// Simple Go code for Zeera project management flow
export const goApplicationCode = `func manageProject() {
    status := "active"
    
    if status == "active" {
        createSprint()
        assignTasks()
    } else {
        archiveProject()
    }
    
    trackProgress()
}`;

// Apple Cards Carousel data for project showcase
export const appleCardsData = [
  {
    category: "Sprint Planning",
    title: "Agile Sprint Management",
    src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Plan your sprints with powerful tools that help teams organize, prioritize, and track progress throughout the development cycle. Create detailed user stories, estimate story points, and manage backlogs with ease. Our intuitive sprint planning interface allows you to drag and drop tasks, set sprint goals, and monitor team capacity to ensure optimal productivity and delivery.",
  },
  {
    category: "Team Collaboration",
    title: "Real-time Collaboration",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Collaborate seamlessly with your team members in real-time, share updates, and keep everyone aligned on project goals. Built-in chat, video conferencing, screen sharing, and collaborative document editing ensure your distributed team stays connected. Get instant notifications, share files, and maintain transparency across all project communications and decisions.",
  },
  {
    category: "Task Management",
    title: "Smart Task Tracking",
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Track every task with intelligent automation, custom workflows, and detailed progress monitoring. Create custom task templates, set dependencies, automate status updates, and generate detailed reports. Our AI-powered task management learns from your patterns to suggest optimizations and predict potential bottlenecks before they impact your timeline.",
  },
  {
    category: "Analytics & Reporting",
    title: "Advanced Project Analytics",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Analyze performance with comprehensive reporting tools, burndown charts, and team velocity metrics. Track sprint velocity, monitor team performance, identify trends, and make data-driven decisions. Generate custom reports for stakeholders, export data for further analysis, and use predictive analytics to improve future sprint planning and resource allocation.",
  },
  {
    category: "Integration Hub",
    title: "Seamless Tool Integration",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Connect with all your favorite tools and services through our extensive integration library. Sync with GitHub, GitLab, Slack, Microsoft Teams, Jira, Confluence, and 100+ other tools. Automate workflows between platforms, sync data in real-time, and create a unified workspace that brings all your project tools together in one powerful dashboard.",
  },
  {
    category: "Security & Compliance",
    title: "Enterprise-Grade Security",
    src: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    content:
      "Protect your projects with bank-level security and compliance features. End-to-end encryption, SSO integration, role-based access controls, audit trails, and GDPR compliance ensure your data stays secure. Meet enterprise security requirements with SOC 2 Type II certification, regular security audits, and 99.9% uptime SLA.",
  },
];

// Testimonials data
export const testimonials = [
  {
    quote:
      "Zeera transformed our project management workflow. The intuitive interface and powerful features helped us deliver projects 40% faster.",
    name: "Sarah Chen",
    designation: "Product Manager at TechCorp",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote:
      "The collaboration features in Zeera are game-changing. Our distributed team feels more connected than ever before.",
    name: "Marcus Rodriguez",
    designation: "Engineering Lead at StartupXYZ",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
 
];

// FAQ data
export const faqs = [
  {
    question: "What makes Zeera different from other project management tools?",
    answer:
      "Zeera combines intuitive design with powerful automation features, AI-driven insights, and seamless collaboration tools. Our focus on user experience and productivity sets us apart.",
  },
  {
    question: "Can I integrate Zeera with my existing tools?",
    answer:
      "Yes! Zeera integrates with 100+ popular tools including Slack, GitHub, Jira, Google Workspace, and more. Our API also allows custom integrations.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to get started.",
  },
  {
    question: "How secure is my data with Zeera?",
    answer:
      "Security is our top priority. We use enterprise-grade encryption, SOC 2 compliance, and regular security audits to ensure your data is safe.",
  },
  {
    question: "Can I customize Zeera for my team's specific needs?",
    answer:
      "Yes! Zeera offers extensive customization options including custom workflows, templates, fields, and dashboards to match your team's unique processes.",
  },
];

// Features data - Real Scrum/Project Management features
export const features = [
  {
    title: "Sprint Planning",
    description:
      "Plan and organize your sprints with user story estimation, velocity tracking, and sprint goal setting.",
    link: "#sprint-planning",
  },
  {
    title: "Scrum Board",
    description:
      "Visual kanban boards with customizable workflows, drag-and-drop functionality, and real-time updates.",
    link: "#scrum-board",
  },
  {
    title: "Backlog Management",
    description:
      "Prioritize user stories, manage product backlog, and track requirement changes effectively.",
    link: "#backlog-management",
  },
  {
    title: "Daily Standups",
    description:
      "Facilitate daily standup meetings with progress tracking, blockers identification, and team updates.",
    link: "#daily-standups",
  },
  {
    title: "Burndown Charts",
    description:
      "Track sprint progress with visual burndown charts, velocity metrics, and completion forecasting.",
    link: "#burndown-charts",
  },
  {
    title: "Retrospectives",
    description:
      "Conduct effective sprint retrospectives with action item tracking and continuous improvement.",
    link: "#retrospectives",
  },
  {
    title: "Epic Management",
    description:
      "Break down large features into manageable epics with clear roadmaps and progress tracking.",
    link: "#epic-management",
  },
  {
    title: "Team Velocity",
    description:
      "Monitor team performance with velocity calculations, capacity planning, and workload distribution.",
    link: "#team-velocity",
  },
  {
    title: "Release Planning",
    description:
      "Plan product releases with feature prioritization, timeline estimation, and deployment tracking.",
    link: "#release-planning",
  },
];

// Icon slugs for the icon cloud
export const iconSlugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "nodejs",
  "python",
  "java",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "swift",
  "kotlin",
  "dart",
  "flutter",
  "reactnative",
  "html5",
  "css3",
  "sass",
  "tailwindcss",
  "bootstrap",
  "materialui",
  "figma",
  "sketch",
  "adobeillustrator",
  "adobephotoshop",
  "docker",
  "kubernetes",
  "aws",
  "googlecloud",
  "azure",
  "vercel",
  "netlify",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "elasticsearch",
  "git",
  "github",
  "gitlab",
  "bitbucket",
  "jira",
  "confluence",
  "slack",
  "discord",
  "zoom",
  "microsoftteams",
  "notion",
  "trello",
  "asana",
];
