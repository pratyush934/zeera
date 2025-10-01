'use client'

import { SprintWithId } from "@/interfaces/sprintInterface";
import React from "react";

const SprintManager = ({
  sprint,
  sprints,
  setStprint,
  projectId,
}: {
  sprint: SprintWithId;
  sprints: SprintWithId[];
  setSprint: any;
  projectId: string;
}) => {
  return <div>SprintManager</div>;
};

export default SprintManager;
