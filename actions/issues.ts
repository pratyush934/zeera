"use server";

import { IssueInterface, CreateIssueData } from "@/interfaces/issueInterface";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getIssuesForSprint(sprintId: string) {
  console.log(
    "🔵 getIssuesForSprint called with sprintId:",
    sprintId,
    "at",
    new Date().toISOString()
  );

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(`there is no userId or orgId in getIssuesForSprint`);
    throw new Error("Bla Bla Bla");
  }

  // Get the project ID from the sprint to also fetch unassigned issues
  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    select: { projectId: true },
  });

  if (!sprint) {
    console.log(`Sprint ${sprintId} not found`);
    return [];
  }

//   console.log(`🔍 Sprint found with projectId: ${sprint.projectId}`);

  // No debug logging to prevent issues

  const issues = await db.issue.findMany({
    where: {
      OR: [
        { sprintId: sprintId }, // Issues assigned to this sprint
        { 
          projectId: sprint.projectId,
          sprintId: null // Issues in the same project but not assigned to any sprint
        }
      ]
    },
    include: {
      reporter: true,
      assignee: true,
    },
    orderBy: [{ status: "asc" }, { order: "asc" }],
  });

  // Return issues without any auto-assignment to prevent loops

  if (!issues) {
    console.log(`there is problem while getting issue`);
    throw new Error("No issue");
  }
  return issues;
}

export async function createIssue(data: CreateIssueData, projectId: string, sprintId?: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log("userId or orgId is not there in createIssue");
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  const lastIssue = await db.issue.findFirst({
    where: {
      projectId: projectId,
      status: data.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
    },
    orderBy: {
      order: "desc",
    },
  });

  const newOrder = lastIssue ? lastIssue?.order + 1 : 0;

  // Convert Clerk user ID to database user ID if assignee is provided
  let assigneeDbId = null;
  if (data.assigneeId) {
    const assigneeUser = await db.user.findUnique({
      where: {
        clerkUserId: data.assigneeId,
      },
    });
    assigneeDbId = assigneeUser?.id || null;
  }

  const newIssue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
      reporterId: user?.id,
      order: newOrder,
      priority: data.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      projectId: projectId,
      sprintId: sprintId || data.sprintId || null,
      assigneeId: assigneeDbId,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  if (!newIssue) {
    console.log(`new issue is created and it is great`);
    return null;
  }
  return newIssue;
}

export async function UpdateIssuesOrder(updatedIssues: IssueInterface[]) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(
      `userId or orgId either of them is not available in UpdateIssuesOrder`
    );
    return null;
  }

  await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: {
          id: issue.id,
        },
        data: {
          status: issue.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(`userId or orgId just don't exist there in the deleteIssue`);
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`user does not exist in deleteIssue`);
    return null;
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      Project: true,
    },
  });

  if (issue?.reporterId !== user?.id) {
    console.log(`User is not the reporter of this issue`);
    return null;
  }

  await db.issue.delete({
    where: {
      id: issueId,
    },
    include: {
      Project: true,
    },
  });

  return { success: true };
}

export async function UpdateIssue(issueId: string, Issue: IssueInterface) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(`userId or orgId just don't exist there in the deleteIssue`);
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    console.log(`user does not exist in deleteIssue`);
    return null;
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      Project: true,
    },
  });

  if (issue?.Project?.organisationId !== orgId) {
    console.log(`organisation just didn't match there`);
    return null;
  }

  // Convert Clerk user ID to database user ID if assignee is provided
  let assigneeDbId = null;
  if (Issue.assigneeId) {
    const assigneeUser = await db.user.findUnique({
      where: {
        clerkUserId: Issue.assigneeId,
      },
    });
    assigneeDbId = assigneeUser?.id || null;
  }

  const updatedOne = await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      title: Issue.title,
      description: Issue.description,
      status: Issue.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
      priority: Issue.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      assigneeId: assigneeDbId,
      sprintId: Issue.sprintId,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return updatedOne;
}
