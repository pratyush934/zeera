"use server";

import { IssueInterface } from "@/interfaces/issueInterface";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getIssuesForSprint(sprintId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    console.log(`there is no userId or orgId in getIssuesForSprint`);
    return null;
  }

  const issues = await db.issue.findMany({
    where: {
      sprintId: sprintId,
    },
    include: {
      reporter: true,
      assignee: true,
    },
    orderBy: [{ status: "asc" }, { order: "asc" }],
  });

  if (!issues) {
    console.log(`there is problem while getting issue`);
    return null;
  }
  return issues;
}

export async function createIssue(data: IssueInterface, projectId: string) {
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

  const newIssue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
      reporterId: user?.id,
      order: newOrder,
      priority: data.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      projectId: projectId,
      assigneeId: data.assigneeId || "NULL",
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

  if (issue?.reporterId !== userId) {
    console.log(`not so good and you have to understand it`);
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

  const updatedOne = await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      status: Issue.status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
      priority: Issue.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return updatedOne;
}
