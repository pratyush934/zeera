"use server"

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

export async function getProjectes(organisationId: string) {
  const { userId } = await auth();

  if (!userId) {
    console.log(
      `there is an issue with userId and please look at this in getProjects`
    );
    return null;
  }

  console.log(organisationId);
}
