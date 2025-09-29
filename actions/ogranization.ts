"use server";

import db from "@/lib/prisma";
import { auth, clerkClient, clerkClient } from "@clerk/nextjs/server";
import { exportPages } from "next/dist/export/worker";

/* 
    1. getOrganizations
    2. checkwhether the user belongs to this organisation or not
*/

export async function getOrganization(slug: string) {
  const { userId } = await auth();

  const client = await clerkClient();

  if (!userId) {
    console.log(`the user is not authorized, check getOrganization method`);
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`the user is not in the db, check getOrganization`);
    return null;
  }

  const organisation = await client.organizations.getOrganization({
    slug: slug,
  });

  if (!organisation) {
    console.log(
      `organization with the slug --- ${slug} --- do not exist, check getOrganisation`
    );
    return null;
  }

  const { data: membership } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: organisation.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null;
  }

  return organisation;
}

export async function getProjects(orgId: string) {
  const { userId } = await auth();

  if (!userId) {
    console.log(
      `the userId is not there via await auth, please look at the getProjects`
    );
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`not able to get the user, please look at the getProjects`);
    return null;
  }

  const projects = await db.project.findMany({
    where: {
      organisationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function getUserIssues(userId: string) {
  const { orgId } = await auth();

  console.log(orgId + userId);
}
