"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Zap,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        {
          name: "Features",
          href: "/features",
          icon: <Zap className="h-3 w-3" />,
        },
        {
          name: "Pricing",
          href: "/pricing",
          icon: <BarChart3 className="h-3 w-3" />,
        },
        {
          name: "Templates",
          href: "/templates",
          icon: <FileText className="h-3 w-3" />,
        },
        {
          name: "Integrations",
          href: "/integrations",
          icon: <Settings className="h-3 w-3" />,
        },
        {
          name: "Roadmap",
          href: "/roadmap",
          icon: <Calendar className="h-3 w-3" />,
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          name: "Documentation",
          href: "/docs",
          icon: <FileText className="h-3 w-3" />,
        },
        {
          name: "Help Center",
          href: "/help",
          icon: <HelpCircle className="h-3 w-3" />,
        },
        {
          name: "Community",
          href: "/community",
          icon: <Users className="h-3 w-3" />,
        },
        { name: "Blog", href: "/blog", icon: <Globe className="h-3 w-3" /> },
        {
          name: "API Reference",
          href: "/api",
          icon: <Settings className="h-3 w-3" />,
        },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about", icon: <Users className="h-3 w-3" /> },
        {
          name: "Careers",
          href: "/careers",
          icon: <Users className="h-3 w-3" />,
        },
        {
          name: "Contact",
          href: "/contact",
          icon: <Mail className="h-3 w-3" />,
        },
        { name: "Press", href: "/press", icon: <Globe className="h-3 w-3" /> },
        {
          name: "Partners",
          href: "/partners",
          icon: <Users className="h-3 w-3" />,
        },
      ],
    },
    {
      title: "Support",
      links: [
        {
          name: "Help Desk",
          href: "/support",
          icon: <MessageSquare className="h-3 w-3" />,
        },
        {
          name: "Status",
          href: "/status",
          icon: <Shield className="h-3 w-3" />,
        },
        {
          name: "Security",
          href: "/security",
          icon: <Shield className="h-3 w-3" />,
        },
        {
          name: "Contact Sales",
          href: "/sales",
          icon: <Mail className="h-3 w-3" />,
        },
        {
          name: "Enterprise",
          href: "/enterprise",
          icon: <Users className="h-3 w-3" />,
        },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/pratyush934",
      icon: <Github className="h-4 w-4" />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/@Pratyush934",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      name: "Email",
      href: "mailto:hello@zeera.app",
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  Z
                </span>
              </div>
              <span className="text-xl font-bold">Zeera</span>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Modern project management platform that helps teams stay
              organized, collaborate effectively, and deliver results faster.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors"
                  asChild
                >
                  <Link href={social.href} aria-label={social.name}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Stay updated</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="sm" className="px-3">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
            <p>&copy; {currentYear} Zeera. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-foreground transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>

          {/* Scroll to Top Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUp className="h-3 w-3" />
            <span>Back to top</span>
          </Button>
        </div>

        {/* Mobile-friendly flexbox alternative for smaller screens */}
        <div className="block md:hidden mt-8">
          <div className="flex flex-wrap justify-center space-x-4 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              Made with ❤️ for teams
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
