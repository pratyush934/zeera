import { getProjects } from "@/actions/ogranization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, FolderOpen, Plus, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProjectList = async ({
  params,
}: {
  params: { organisationId: string };
}) => {
  const { organisationId } = params;
  const listOfProjects = await getProjects(organisationId);

  if (!listOfProjects) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don&apos;t have any projects yet. Create your first project to get
          started with managing your tasks and sprints.
        </p>
        <Link href="/project/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>
    );
  }

  if (listOfProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first project to start organizing your work and
          collaborating with your team.
        </p>
        <Link href="/project/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage and organize your team&apos;s work across{" "}
            {listOfProjects.length}{" "}
            {listOfProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Link href="/project/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listOfProjects.map((project) => (
          <Card
            key={project.id}
            className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {project.key}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              {project.description && (
                <CardDescription className="line-clamp-2 text-sm">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="pb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-primary">
                    {project._count.issues}
                  </span>
                  <span className="text-xs text-muted-foreground">Issues</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-blue-600">
                    {project._count.sprints}
                  </span>
                  <span className="text-xs text-muted-foreground">Sprints</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="flex w-full gap-2">
                <Link href={`/project/${project.id}`} className="flex-1">
                  <Button variant="default" className="w-full">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Open Project
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {listOfProjects.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {listOfProjects.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {listOfProjects.reduce(
                (acc, project) => acc + project._count.issues,
                0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
