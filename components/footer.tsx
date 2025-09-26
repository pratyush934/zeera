"use client";

import React from 'react';
import Link from 'next/link';
import { 
  footerSections, 
  socialLinks, 
  brandInfo, 
  legalLinks, 
  footerConfig 
} from '@/constants/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Zap,
  BarChart3,
  FileText,
  Settings,
  Calendar,
  HelpCircle,
  Users,
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Github,
  Twitter,
  Linkedin,
  ArrowUp,
  Send,
  ExternalLink
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Zap,
  BarChart3,
  FileText,
  Settings,
  Calendar,
  HelpCircle,
  Users,
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Github,
  Twitter,
  Linkedin,
};

const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (iconName: string, size = 16) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  return (
    <footer className="bg-background border-t border-border relative">
      {/* Newsletter Section */}
      {footerConfig.showNewsletter && (
        <div className="bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Stay in the loop
              </h3>
              <p className="text-muted-foreground mb-6">
                Get the latest updates, tips, and insights delivered straight to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isSubscribed}>
                  {isSubscribed ? (
                    <>Subscribed! ✓</>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                {brandInfo.logo}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-foreground">{brandInfo.name}</span>
                {brandInfo.status && (
                  <Badge variant="secondary" className="text-xs">
                    {brandInfo.status}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {brandInfo.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <TooltipProvider>
                {socialLinks.map((social) => (
                  <Tooltip key={social.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-9 w-9 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Link href={social.href} target="_blank" rel="noopener noreferrer">
                          {getIcon(social.icon, 18)}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            {footerConfig.showMobileMessage && (
              <div className="block md:hidden pt-2">
                <p className="text-sm text-muted-foreground">
                  {footerConfig.mobileMessage}
                </p>
              </div>
            )}
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 group"
                    >
                      <span className="text-muted-foreground/70 group-hover:text-foreground/70">
                        {getIcon(link.icon, 14)}
                      </span>
                      <span>{link.name}</span>
                      {link.href.startsWith('http') && (
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {brandInfo.name}. {footerConfig.copyrightText}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-muted-foreground/50 text-xs">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Scroll to Top Button */}
          {footerConfig.showScrollToTop && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollToTop}
                    className="h-9 w-9 hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowUp size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Performance optimization: Reduce layout shift */}
      <div className="h-0 overflow-hidden" aria-hidden="true">
        {Object.values(iconMap).map((Icon, index) => (
          <Icon key={index} size={0} />
        ))}
      </div>
    </footer>
  );
};

export default Footer;