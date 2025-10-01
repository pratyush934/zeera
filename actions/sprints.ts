"use server";

import { Sprint } from "@/interfaces/sprintInterface";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function CreateSprint(data: Sprint, projectId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(`how dare you ? , you are unauthorized in CreateSprint`);
    return null;
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project || project.organisationId !== orgId) {
    console.log(
      `your bad luck , the we are not able to fetch the project or project.organisationId !== orgId, in CreateSprint`
    );
    return null;
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "ACTIVE",
      projectId: projectId,
    },
  });

  return sprint;
}

export async function UpdateSprintStatus(sprintId: string, newStatus: string) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    console.log(`userId or orgId is not there in UpdateSprintStatus`);
    return null;
  }

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: {
      project: true,
    },
  });

  if (sprint?.project.organisationId != orgId) {
    console.log(
      `not so great as the organisationId is not same in UpdateSrpintStatus`
    );
    return null;
  }

  if (orgRole !== "org:admin") {
    console.log(
      `how dare you ?, you are not even a admin, in UpdateSprintStatus`
    );
    return null;
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (sprint.status === "ACTIVE" && (now < startDate || now > endDate)) {
    console.log(`you have run out of time`);
    return null;
  }

  if (sprint.status !== "ACTIVE" && newStatus === "COMPLETED") {
    console.log(
      `thodi sharm karo bhai , sprint status is not active , updateSprintStatus`
    );
    return null;
  }

  const updatedSprint = await db.sprint.update({
    where: {
      id: sprintId,
    },
    data: {
      status: newStatus as "PLANNED" | "COMPLETED" | "ACTIVE",
    },
  });

  if (!updatedSprint) {
    console.log(`sorry we are not able to update the status`);
    return null;
  }

  return { success: true, updatedSprint: updatedSprint };
}
