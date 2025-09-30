"use client";

import { createProject } from "@/actions/projects";
import OrgSwitcher from "@/components/org-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuroraText } from "@/components/ui/aurora-text";
import { Meteors } from "@/components/ui/meteors";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Building2,
  FolderPlus,
  Key,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schema
const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Project name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  key: z
    .string()
    .min(2, "Project key must be at least 2 characters")
    .max(10, "Project key must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Project key must be uppercase letters and numbers only"
    )
    .transform((val) => val.toUpperCase()),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const Create = () => {
  const { isLoaded: isOrgLoaded, membership, organization } = useOrganization();
  const { isLoaded } = useUser();
  const router = useRouter();

  const [isAdmin, setAdmin] = useState<boolean>(false);
  
  const {
    data: createdProject,
    error: submitError,
    isLoading: isSubmitting,
    fn: createProjectFn,
  } = useFetch(createProject);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const watchedName = watch("name");

  // Auto-generate project key from name
  useEffect(() => {
    if (watchedName) {
      const generatedKey = watchedName
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .split(" ")
        .map((word) => word.slice(0, 3))
        .join("")
        .slice(0, 6);
      setValue("key", generatedKey);
    }
  }, [watchedName, setValue]);

  useEffect(() => {
    if (isOrgLoaded && isLoaded && membership) {
      setAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isLoaded, membership]);

  // Handle successful project creation
  useEffect(() => {
    if (createdProject && typeof createdProject === 'object' && 'id' in createdProject) {
      toast.success("Project created successfully!");
      router.push(`/project/${createdProject.id}`);
    }
  }, [createdProject, router]);

  const onSubmit = async (data: ProjectFormData) => {
    await createProjectFn(data);
  };

  if (!isOrgLoaded || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Permission Denied Card */}
        <Card className="relative border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <div className="absolute inset-0 overflow-hidden">
            <Meteors number={20} />
          </div>
          <CardHeader className="relative text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-amber-800 dark:text-amber-200">
              Admin Access Required
            </CardTitle>
            <CardDescription className="text-base text-amber-700 dark:text-amber-300">
              You need administrator privileges to create projects in this
              organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative text-center space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Only organization administrators can create new projects. Please
                contact your organization admin to:
              </p>
              <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-2">
                <li>• Request admin privileges</li>
                <li>• Ask them to create the project for you</li>
                <li>• Switch to an organization where you have admin access</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-amber-200 dark:border-amber-800">
              <div className="space-y-4">
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                  Switch to a different organization:
                </p>
                <OrgSwitcher />
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href={
                  organization
                    ? `/organization/${organization.slug}`
                    : "/onboarding"
                }
              >
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <AuroraText className="text-4xl font-bold">
          Create New Project
        </AuroraText>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start your next big idea with a well-structured project. Define your
          goals, set up your team, and begin building something amazing.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{organization?.name}</span>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={30} />
        </div>

        <CardHeader className="relative text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FolderPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Project Details
          </CardTitle>
          <CardDescription className="text-base">
            Fill in the information below to create your new project
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name Field */}
            <div className="space-y-3">
              <label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Project Name
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your project name (e.g., Mobile Banking App)"
                className={cn(
                  "h-12 text-base",
                  errors.name && "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Project Key Field */}
            <div className="space-y-3">
              <label
                htmlFor="key"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Project Key
              </label>
              <Input
                id="key"
                {...register("key")}
                placeholder="Auto-generated from project name"
                className={cn(
                  "h-12 text-base font-mono tracking-wider",
                  errors.key && "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.key && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {errors.key.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be used as a unique identifier for your project (e.g.,
                MOBBANK)
              </p>
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label htmlFor="description" className="text-sm font-medium">
                Project Description
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your project goals, features, and objectives..."
                className={cn(
                  "min-h-[120px] text-base resize-none",
                  errors.description &&
                    "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {submitError}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Link
                href={
                  organization
                    ? `/organization/${organization.slug}`
                    : "/onboarding"
                }
                className="sm:w-auto w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex-1 sm:flex-none sm:w-auto h-12 text-base font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
