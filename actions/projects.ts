"use server";

import { ProjectInterface } from "@/interfaces/projectInterface";
import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: ProjectInterface) {
  const { userId, orgId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    console.log(
      `in createProject, userId both of there are not there available`
    );
    return null;
  }

  if (!orgId) {
    console.log(
      `in createProject, orgId  both of there are not there available`
    );
    return null;
  }

  const { data: members } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const usersMemebership = members.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!usersMemebership || usersMemebership.role !== "org:admin") {
    console.log(
      `the userMemebership or the same role does not exist here in createProject`
    );
    return null;
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organisationId: orgId,
      },
    });
    return project;
  } catch (error) {
    console.log(`error while creating the project, here is the ${error}`);
    throw new Error("Error is in the createProject");
  }
}

export async function getProjects(projectId: string) {
  const { userId, orgId } = await auth();

  if (!userId) {
    console.log(`userId is not there in getProjects`);
    return null;
  }

  if (!orgId) {
    console.log(`orgId is not there in getProjects`);
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`there is not user with the userId ${userId}`);
    return null;
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    console.log(`there is not project with the projectId ${project}`);
    return null;
  }

  if (project.organisationId !== orgId) {
    console.log(
      `there is a mismatch in organisationId and orgId in getProjects`
    );
    return null;
  }

  return project;
}

export async function DeleteProject(projectId: string) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    console.log(`userId is not there in getProjects`);
    return null;
  }

  if (orgRole !== "org:admin") {
    console.log(`how dare you ?, you are not an admin`);
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organisationId !== orgId) {
    console.log(
      `either the project does not exist or ogranisationId !=== orgId in DeleteProject`
    );
    return null;
  }

  const success = await db.project.delete({
    where: { id: projectId },
  });

  if (!success) {
    console.log(`such a shame you littlefinger , in DeleteProject`);
    return null;
  }
  return { success: true };
}
