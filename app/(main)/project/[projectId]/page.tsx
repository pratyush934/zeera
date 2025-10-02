import { getProjects } from "@/actions/projects";
import SprintCreation from "../_components/sprint-creation";
import { Separator } from "@/components/ui/separator";
import SprintBoard from "../_components/sprint-board";

const Project = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  const project = await getProjects(projectId);

  return (
    <>
      <div className="mb-20">
        {/* sprint creation */}
        <SprintCreation
          projectId={project?.id as string}
          projectTitle={project?.name as string}
          projectKey={project?.key as string}
          sprintKey={(project?.sprints.length as number) + 1}
        />

        {/* seperator */}
        <Separator />

        <>
          {project?.sprints && project.sprints.length > 0 ? (
            <SprintBoard
              projectId={projectId}
              sprint={project.sprints}
              organisationId={project.organisationId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No Sprints Yet
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Get started by creating your first sprint above. Sprints help
                you organize and track your project work in focused time
                periods.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Use the form above to create your first sprint</span>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default Project;
