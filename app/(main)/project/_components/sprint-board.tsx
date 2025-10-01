'use client'

import React, { useState } from "react";
import { SprintWithId } from "@/interfaces/sprintInterface";
import SprintManager from "./sprint-manager";

const SprintBoard = ({
  sprint,
  projectId,
  organisationId,
}: {
  sprint:  SprintWithId[];
  projectId: string;
  organisationId: string;
}) => {
  console.log(sprint, projectId, organisationId);

  const [currentSprint, setCurrentSprint] = useState(
    sprint.find((spr) => spr.status === "ACTIVE") || sprint[0]
  );



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sprint Board</h2>

      <SprintManager sprint={currentSprint} sprints={sprint} setSprint={setCurrentSprint} projectId={projectId}/>

      {/* Display sprints */}
      {Array.isArray(sprint) ? (
        <div className="space-y-4">
          {sprint.map((s: SprintWithId) => (
            <div key={s.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(s.startDate).toLocaleDateString()} -{" "}
                {new Date(s.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm">Status: {s.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">{sprint.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(sprint.startDate).toLocaleDateString()} -{" "}
            {new Date(sprint.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm">Status: {sprint.status}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Project ID: {projectId}</p>
        <p>Organization ID: {organisationId}</p>
      </div>
    </div>
  );
};

export default SprintBoard;
