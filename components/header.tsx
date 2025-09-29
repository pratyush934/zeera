import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CheckUser } from "@/lib/checkUser";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { BarChart3, FolderOpen, Home, Menu, Plus, Users } from "lucide-react";
import Link from "next/link";
import UserLoading from "./user-loading";
import UserMenu from "./user-menu";

const Header = async () => {

  await CheckUser();

  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Team", href: "/team", icon: Users },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="mr-4 flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Access all your project management tools
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Section - Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Logo with gradient background */}
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                Z
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-9 h-9 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm -z-10" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Zeera
              </span>
              <Badge variant="secondary" className="text-xs font-medium">
                Beta
              </Badge>
            </div>
          </Link>
        </div>

        {/* Center Section - Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Create Project Button (when signed in) */}
          <SignedIn>
            <Link href={"/project/create"}>
              <Button
                size="sm"
                className="hidden sm:flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </Button>
            </Link>
          </SignedIn>

          {/* Theme Toggler */}
          <div className="flex items-center">
            <AnimatedThemeToggler className="h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background" />
          </div>

          {/* User Authentication */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton forceRedirectUrl="/onboarding">
                <RainbowButton variant="outline">Login</RainbowButton>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>
        </div>
      </div>

      <UserLoading />
    </header>
  );
};

export default Header;
