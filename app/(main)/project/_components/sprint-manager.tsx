"use client";

import { SprintWithId } from "@/interfaces/sprintInterface";
import { format, isAfter, isBefore } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { UpdateSprintStatus } from "@/actions/sprints";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";

const SprintManager = ({
  sprint,
  sprints,
  setSprint,
  projectId,
}: {
  sprint: SprintWithId;
  sprints: SprintWithId[];
  setSprint: React.Dispatch<React.SetStateAction<SprintWithId>>;
  projectId: string;
}) => {
  const [status, setStatus] = useState(sprint.status);
  const router = useRouter();
  const processedUpdateRef = useRef<string | null>(null);

  // Use the useFetch hook for UpdateSprintStatus
  const {
    data: updateResult,
    error: updateError,
    isLoading: isUpdating,
    fn: updateSprintFn,
  } = useFetch(UpdateSprintStatus);

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  // Handle sprint status update result
  useEffect(() => {
    if (updateResult && updateResult.success) {
      // Create a unique key for this update to prevent duplicate processing
      const updateKey = `${updateResult.updatedSprint.id}-${updateResult.updatedSprint.status}-${updateResult.updatedSprint.updatedAt}`;

      // Only process if we haven't processed this update before
      if (processedUpdateRef.current !== updateKey) {
        processedUpdateRef.current = updateKey;

        const newStatus = updateResult.updatedSprint.status;
        setStatus(newStatus);

        // Update the sprint in the parent component
        const updatedSprint = { ...sprint, status: newStatus };
        setSprint(updatedSprint);

        toast.success(
          newStatus === "ACTIVE"
            ? "Sprint started successfully!"
            : "Sprint completed successfully!"
        );
      }
    } else if (updateResult && !updateResult.success) {
      toast.error(
        "Failed to update sprint status. Please check your permissions."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateResult]); // Only depend on updateResult to avoid infinite loops

  // Handle update errors
  useEffect(() => {
    if (updateError) {
      toast.error(`Error updating sprint: ${updateError}`);
    }
  }, [updateError]);

  // Update status when sprint changes (for sprint selection)
  useEffect(() => {
    setStatus(sprint.status);
  }, [sprint.id, sprint.status]);

  // Edge conditions for sprint actions
  const canStart =
    isBefore(now, endDate) &&
    isAfter(now, startDate) &&
    sprint.status === "PLANNED";

  const canEnd = status === "ACTIVE";

  // Handle sprint selection change
  const handleSprintChange = (value: string) => {
    const selectSprint = sprints.find((s) => s.id === value);
    if (selectSprint) {
      setSprint(selectSprint);
      setStatus(selectSprint.status);
      // No need to navigate since we're just changing local state
    }
  };

  // Handle sprint status change (Start/End sprint)
  const handleStatusChange = async (newStatus: "ACTIVE" | "COMPLETED") => {
    if (!sprint.id) {
      toast.error("Sprint ID is missing");
      return;
    }

    // Additional edge condition checks
    if (newStatus === "ACTIVE" && status !== "PLANNED") {
      toast.error("Can only start a planned sprint");
      return;
    }

    if (newStatus === "COMPLETED" && status !== "ACTIVE") {
      toast.error("Can only complete an active sprint");
      return;
    }

    // Check time constraints for starting a sprint
    if (newStatus === "ACTIVE") {
      if (isBefore(now, startDate)) {
        toast.error("Cannot start sprint before its start date");
        return;
      }
      if (isAfter(now, endDate)) {
        toast.error("Cannot start sprint after its end date");
        return;
      }
    }

    // Use the useFetch hook to call UpdateSprintStatus
    // The success handling is done in the useEffect above
    await updateSprintFn(sprint.id, newStatus);
  };

  // Get status text for badge
  const getStatusText = () => {
    switch (status) {
      case "PLANNED":
        if (isBefore(now, startDate)) {
          return `Starts in ${Math.ceil(
            (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )} days`;
        }
        if (isAfter(now, endDate)) {
          return "Overdue - Not started";
        }
        return "Ready to start";
      case "ACTIVE":
        if (isAfter(now, endDate)) {
          return "Overdue - Should be completed";
        }
        return `${Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )} days remaining`;
      case "COMPLETED":
        return "Completed";
      default:
        return "";
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = () => {
    switch (status) {
      case "PLANNED":
        if (isAfter(now, endDate)) return "destructive";
        return "secondary";
      case "ACTIVE":
        if (isAfter(now, endDate)) return "destructive";
        return "default";
      case "COMPLETED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {/* Sprint Selection and Actions */}
      <div className="flex items-center gap-4 flex-wrap max-w-[100%]">
        <div className="flex-1 min-w-[250px]">
          <Select value={sprint.id} onValueChange={handleSprintChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map((sprintItem) => {
                return (
                  <SelectItem key={sprintItem.id} value={sprintItem.id}>
                    {sprintItem.name} (
                    {format(new Date(sprintItem.startDate), "MMM d, yyyy")} to{" "}
                    {format(new Date(sprintItem.endDate), "MMM d, yyyy")})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canStart && (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              Start Sprint
            </Button>
          )}
          {canEnd && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={isUpdating}
              variant="destructive"
              size="sm"
            >
              End Sprint
            </Button>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isUpdating && (
        <div className="w-full">
          <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />
        </div>
      )}

      {/* Status Badge */}
      {getStatusText() && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={getBadgeVariant()} className="text-xs">
            {getStatusText()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Status: {status}
          </span>
        </div>
      )}

      {/* Sprint Details */}
      {/* <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{sprint.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Start Date:</span>
            <p className="text-muted-foreground">{format(startDate, "PPP")}</p>
          </div>
          <div>
            <span className="font-medium">End Date:</span>
            <p className="text-muted-foreground">{format(endDate, "PPP")}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SprintManager;
