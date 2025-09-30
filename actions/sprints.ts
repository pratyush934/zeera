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
