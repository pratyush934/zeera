"use server";

import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

/* 
    1. getOrganizations
    2. checkwhether the user belongs to this organisation or not
*/

export async function getOrganization(slug: string) {
  const { userId } = await auth();

  const client = await clerkClient();

  console.log(`getOrganization called with slug: ${slug}, userId: ${userId}`);

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

  try {
    const organisation = await client.organizations.getOrganization({
      organizationId: slug,
    });

    console.log(`Found organization:`, organisation?.name);

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
  } catch (error) {
    console.error(`Error in getOrganization:`, error);
    return null;
  }
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
    include: {
      issues: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          issues: true,
          sprints: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function getUserIssues(userId: string) {
  const { orgId } = await auth();

  if (!userId || !orgId) {
    console.log(
      `not able to get the userId or orgId, please look at the getUserIssues`
    );
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`not able to get the user here`);
    return null;
  }

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: userId }, { reporterId: userId }],
      Project: {
        organisationId: orgId,
      },
    },
    include: {
      Project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!issues) {
    console.log(`no issue was found with such parameters`);
    return null;
  }
  return issues;
}

export async function getOrganisationUsers(orgId: string) {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    console.log(`the userId is not there so better make decision`);
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(
      `there is not any user with this userId , look at the getOrganisationUsers`
    );
    return null;
  }

  const members = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userIds = members.data.map((members) => members.publicUserData?.userId);

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds as string[],
      },
    },
  });

  if (!users) {
    console.log(`no users were found with this orgId`);
    return null;
  }

  return users;
}

export async function inviteMemberToOrganization(data: {
  email: string;
  role: "org:admin" | "org:member";
  organizationId: string;
  redirectUrl?: string;
}) {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    console.log(`User not authorized in inviteMemberToOrganization`);
    throw new Error("Unauthorized");
  }

  try {
    // Check if the current user is an admin of the organization
    const { data: membership } =
      await client.organizations.getOrganizationMembershipList({
        organizationId: data.organizationId,
      });

    const userMembership = membership.find(
      (member) => member.publicUserData?.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      console.log(`User is not an admin of the organization`);
      throw new Error("Only organization admins can invite members");
    }

    // Create the invitation using Clerk's backend API
    console.log("Creating invitation with data:", {
      organizationId: data.organizationId,
      emailAddress: data.email,
      role: data.role,
    });

    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: data.organizationId,
      emailAddress: data.email,
      role: data.role,
      redirectUrl:
        data.redirectUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
    });

    console.log(`Successfully created invitation for ${data.email}`);

    // Return only serializable data - NOT the full Clerk object
    return {
      success: true,
      invitation: {
        id: invitation.id,
        emailAddress: invitation.emailAddress,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt,
      },
      message: "Invitation sent successfully!",
    };
  } catch (error: any) {
    console.error(`Error creating invitation:`, error);
    console.error(`Error details:`, error.errors);

    // Handle specific Clerk errors
    if (error.errors && error.errors[0]) {
      const clerkError = error.errors[0];
      console.error(`Clerk error code:`, clerkError.code);
      console.error(`Clerk error message:`, clerkError.message);

      if (clerkError.code === "duplicate_record") {
        return {
          success: false,
          error: "An invitation for this email already exists",
        };
      }
      if (clerkError.code === "user_already_member") {
        return {
          success: false,
          error: "This user is already a member of the organization",
        };
      }
      if (clerkError.code === "invitations_not_supported") {
        return {
          success: false,
          error:
            "Email invitations are not enabled. Please enable email authentication in your Clerk dashboard.",
        };
      }
    }

    return {
      success: false,
      error: error.message || "Failed to send invitation",
    };
  }
}

export async function getOrganizationInvitations(organizationId: string) {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    console.log(`User not authorized in getOrganizationInvitations`);
    throw new Error("Unauthorized");
  }

  try {
    // Check if user is a member of the organization
    const { data: membership } =
      await client.organizations.getOrganizationMembershipList({
        organizationId,
      });

    const userMembership = membership.find(
      (member) => member.publicUserData?.userId === userId
    );

    if (!userMembership) {
      throw new Error("User is not a member of this organization");
    }

    // Get pending invitations
    const { data: invitations } =
      await client.organizations.getOrganizationInvitationList({
        organizationId,
        status: ["pending"],
      });

    return {
      success: true,
      invitations,
    };
  } catch (error: any) {
    console.error(`Error fetching invitations:`, error);
    return {
      success: false,
      error: error.message || "Failed to fetch invitations",
    };
  }
}

export async function revokeOrganizationInvitation(data: {
  organizationId: string;
  invitationId: string;
}) {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    console.log(`User not authorized in revokeOrganizationInvitation`);
    throw new Error("Unauthorized");
  }

  try {
    // Check if the current user is an admin of the organization
    const { data: membership } =
      await client.organizations.getOrganizationMembershipList({
        organizationId: data.organizationId,
      });

    const userMembership = membership.find(
      (member) => member.publicUserData?.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization admins can revoke invitations");
    }

    // Revoke the invitation
    await client.organizations.revokeOrganizationInvitation({
      organizationId: data.organizationId,
      invitationId: data.invitationId,
      requestingUserId: userId,
    });

    return {
      success: true,
      message: "Invitation revoked successfully",
    };
  } catch (error: any) {
    console.error(`Error revoking invitation:`, error);
    return {
      success: false,
      error: error.message || "Failed to revoke invitation",
    };
  }
}
