import { getProjects } from "@/actions/projects";
import SprintCreation from "../_components/sprint-creation";
import { Separator } from "@/components/ui/separator";
import SprintBoard from "../_components/sprint-board";

const Project = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

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
            <>
              <h1>I am there </h1>
              <SprintBoard
                projectId={projectId}
                sprint={project.sprints}
                organisationId={project.organisationId}
              />
            </>
          ) : (
            <h1>I am not there</h1>
          )}
        </>
      </div>
    </>
  );
};

export default Project;
