import { getUserIssues } from "@/actions/ogranization";
import React from "react";

const UserIssues = async (userId: string) => {
  const issues = await getUserIssues(userId);

  if (issues?.length === 0) {
    return null;
  }

  const assignedIdIssue = issues?.filter(
    (issue) => issue.assigneeId === userId
  );

  const reportedIdIssue = issues?.filter(
    (issue) => issue.reporterId === userId
  );

  return <div>UserIssues</div>;
};

export default UserIssues;
