import { getProjects } from "@/actions/projects";
import React from "react";
import SprintCreation from "../_components/sprint-creation";

const Project = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  const project = await getProjects(projectId);

  return (
    <div>
      ProjectId: {params.projectId}
      {/* sprint creation */}
      <SprintCreation
        projectId={project?.id as string}
        projectTitle={project?.name as string}
        projectKey={project?.key as string}
        sprintKey={(project?.sprints.length as number) + 1}
      />
      {/* sprint board */}

      
    </div>
  );
};

export default Project;
