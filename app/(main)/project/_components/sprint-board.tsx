"use client";

import React, { useState, useEffect, useRef } from "react";
import { SprintWithId } from "@/interfaces/sprintInterface";
import { IssueInterface, IssueStatus } from "@/interfaces/issueInterface";
import SprintManager from "./sprint-manager";
import IssueCard from "@/components/issue-card";
import CreateIssueDrawer from "./create-issue";
import IssueCardDetails from "@/components/issue-card-details";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { getIssuesForSprint, UpdateIssuesOrder } from "@/actions/issues";
import { BarLoader } from "react-spinners";

const statusColumns = [
  { 
    id: "TODO", 
    title: "📋 To Do", 
    color: "bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
    headerColor: "bg-slate-200 dark:bg-slate-700",
    textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-200 dark:border-slate-700"
  },
  {
    id: "IN_PROGRESS",
    title: "🚀 In Progress",
    color: "bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50",
    headerColor: "bg-blue-200 dark:bg-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-700"
  },
  {
    id: "IN_REVIEW",
    title: "👀 In Review",
    color: "bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50",
    headerColor: "bg-amber-200 dark:bg-amber-800",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-700"
  },
  { 
    id: "DONE", 
    title: "✅ Done", 
    color: "bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50",
    headerColor: "bg-emerald-200 dark:bg-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-700"
  },
];

const SprintBoard = ({
  sprint,
  projectId,
}: {
  sprint: SprintWithId[];
  projectId: string;
  organisationId: string;
}) => {
  // Component lifecycle tracking removed to reduce console noise

  // Removed cooldown logic to prevent infinite loops

  const [currentSprint, setCurrentSprint] = useState(
    sprint.find((spr) => spr.status === "ACTIVE") || sprint[0]
  );
  const [issues, setIssues] = useState<IssueInterface[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueInterface | null>(
    null
  );
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data: fetchedIssues,
    isLoading: loadingIssues,
    fn: fetchIssues,
  } = useFetch(getIssuesForSprint);

  const { isLoading: updatingOrder, fn: updateIssuesOrder } =
    useFetch(UpdateIssuesOrder);

  // Fetch issues when current sprint changes - only depend on sprint ID to prevent loops
  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint?.id]);

  // Update issues when fetched data changes
  useEffect(() => {
    if (fetchedIssues && Array.isArray(fetchedIssues)) {
      // Remove duplicates before setting state
      const uniqueIssues = fetchedIssues.filter((issue, index, self) => 
        index === self.findIndex(i => i.id === issue.id)
      );
      
      if (uniqueIssues.length !== fetchedIssues.length) {
        console.warn("⚠️ Removed duplicate issues:", fetchedIssues.length - uniqueIssues.length);
      }
      
      setIssues(uniqueIssues);
    }
  }, [fetchedIssues]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, return
    if (!destination) return;

    // If dropped in the same position, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedIssue = issues.find((issue) => issue.id === draggableId);
    if (!draggedIssue) return;

    // Create a copy of issues array
    const newIssues = [...issues];

    // Remove the dragged issue from its original position
    const sourceIssues = newIssues.filter(
      (issue) => issue.status === source.droppableId
    );
    const destIssues = newIssues.filter(
      (issue) => issue.status === destination.droppableId
    );

    // Update the dragged issue's status
    const updatedIssue = {
      ...draggedIssue,
      status: destination.droppableId as IssueStatus,
    };

    // Remove the issue from source array
    const filteredIssues = newIssues.filter(
      (issue) => issue.id !== draggableId
    );

    // Insert the issue at the new position
    if (source.droppableId === destination.droppableId) {
      // Same column reorder
      const columnIssues = sourceIssues.filter(
        (issue) => issue.id !== draggableId
      );
      columnIssues.splice(destination.index, 0, updatedIssue);

      // Update order for the reordered column
      const reorderedIssues = columnIssues.map((issue, index) => ({
        ...issue,
        order: index,
      }));

      // Combine with other columns
      const otherIssues = filteredIssues.filter(
        (issue) => issue.status !== destination.droppableId
      );

      const combinedIssues = [...otherIssues, ...reorderedIssues];
      // Remove any potential duplicates
      const uniqueCombined = combinedIssues.filter((issue, index, self) => 
        index === self.findIndex(i => i.id === issue.id)
      );
      setIssues(uniqueCombined);

      // Update backend
      await updateIssuesOrder(reorderedIssues);
    } else {
      // Different column move
      destIssues.splice(destination.index, 0, updatedIssue);

      // Update order for both columns
      const reorderedSourceIssues = sourceIssues
        .filter((issue) => issue.id !== draggableId)
        .map((issue, index) => ({ ...issue, order: index }));

      const reorderedDestIssues = destIssues.map((issue, index) => ({
        ...issue,
        order: index,
      }));

      // Combine with unchanged columns
      const unchangedIssues = filteredIssues.filter(
        (issue) =>
          issue.status !== source.droppableId &&
          issue.status !== destination.droppableId
      );

      const combinedIssues = [
        ...unchangedIssues,
        ...reorderedSourceIssues,
        ...reorderedDestIssues,
      ];
      
      // Remove any potential duplicates
      const uniqueCombined = combinedIssues.filter((issue, index, self) => 
        index === self.findIndex(i => i.id === issue.id)
      );
      
      setIssues(uniqueCombined);

      // Update backend with both columns
      await updateIssuesOrder([
        ...reorderedSourceIssues,
        ...reorderedDestIssues,
      ]);
    }
  };

  const getIssuesByStatus = (status: string) => {
    // First, remove any duplicate issues by ID
    const uniqueIssues = issues.filter((issue, index, self) => 
      index === self.findIndex(i => i.id === issue.id)
    );
    
    return uniqueIssues
      .filter((issue) => issue.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleIssueClick = (issue: IssueInterface) => {
    setSelectedIssue(issue);
    setIsDetailsOpen(true);
  };

  const handleIssueCreated = (newIssue: IssueInterface) => {
    setIssues((prev) => {
      // Check if issue already exists to prevent duplicates
      const existingIssue = prev.find(issue => issue.id === newIssue.id);
      if (existingIssue) {
        console.warn("⚠️ Issue already exists, not adding duplicate:", newIssue.id);
        return prev;
      }
      return [...prev, newIssue];
    });
    setIsCreateDrawerOpen(false);
  };

  const handleIssueUpdated = (updatedIssue: IssueInterface) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
    );
  };

  const handleIssueDeleted = (deletedIssueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== deletedIssueId));
    setIsDetailsOpen(false);
  };

  if (!currentSprint) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sprint Board</h2>
        <div className="text-center text-muted-foreground py-8">
          No active sprints found. Please create a sprint first.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Sprint Board</h2>
        <Button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="flex items-center gap-2 self-start lg:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Issue
        </Button>
      </div>

      <SprintManager
        sprint={currentSprint}
        sprints={sprint}
        setSprint={setCurrentSprint}
        projectId={projectId}
      />

      {loadingIssues && (
        <div className="flex justify-center py-8">
          <BarLoader color="#3b82f6" />
        </div>
      )}

      {updatingOrder && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-background border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <BarLoader color="#3b82f6" width={50} height={2} />
              <span className="text-sm text-muted-foreground">Updating...</span>
            </div>
          </div>
        </div>
      )}

      {/* Creative Flowing Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative mt-8">
          {/* Flowing Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100/30 via-blue-50/30 to-emerald-50/30 dark:from-slate-800/10 dark:via-blue-900/10 dark:to-emerald-900/10 rounded-3xl" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
            {statusColumns.map((column, index) => (
              <div key={column.id} className="relative">
                {/* Floating Title */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-3 h-3 rounded-full 
                      ${column.id === 'TODO' ? 'bg-slate-400' : 
                        column.id === 'IN_PROGRESS' ? 'bg-blue-500' :
                        column.id === 'IN_REVIEW' ? 'bg-amber-500' : 'bg-emerald-500'}
                      shadow-lg animate-pulse
                    `} />
                    <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">
                      {column.title.replace(/[📋🚀👀✅]/g, '').trim()}
                    </h3>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${column.id === 'TODO' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 
                      column.id === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      column.id === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}
                    shadow-sm backdrop-blur-sm
                  `}>
                    {getIssuesByStatus(column.id).length}
                  </div>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        min-h-[450px] space-y-4 p-4 rounded-2xl
                        transition-all duration-500 ease-out
                        ${snapshot.isDraggingOver
                          ? `scale-105 ${column.id === 'TODO' ? 'bg-slate-200/60 shadow-slate-200' : 
                                        column.id === 'IN_PROGRESS' ? 'bg-blue-200/60 shadow-blue-200' :
                                        column.id === 'IN_REVIEW' ? 'bg-amber-200/60 shadow-amber-200' : 
                                        'bg-emerald-200/60 shadow-emerald-200'} 
                             shadow-2xl dark:shadow-xl backdrop-blur-md
                             ring-2 ring-white/50 dark:ring-gray-800/50`
                          : 'hover:scale-[1.02] hover:shadow-lg'
                        }
                      `}
                    >
                      {/* Empty State */}
                      {getIssuesByStatus(column.id).length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center mb-4
                            ${column.id === 'TODO' ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 
                              column.id === 'IN_PROGRESS' ? 'bg-gradient-to-br from-blue-200 to-blue-300' :
                              column.id === 'IN_REVIEW' ? 'bg-gradient-to-br from-amber-200 to-amber-300' : 
                              'bg-gradient-to-br from-emerald-200 to-emerald-300'}
                          `}>
                            <span className="text-2xl">
                              {column.id === 'TODO' ? '📝' : 
                               column.id === 'IN_PROGRESS' ? '⚡' :
                               column.id === 'IN_REVIEW' ? '👀' : '🎉'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {column.id === 'TODO' ? 'Ready to start' : 
                             column.id === 'IN_PROGRESS' ? 'Work in progress' :
                             column.id === 'IN_REVIEW' ? 'Under review' : 'All done!'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Drop issues here
                          </p>
                        </div>
                      )}
                      
                      {/* Issues */}
                      {getIssuesByStatus(column.id).map((issue, index) => (
                        <Draggable
                          key={`${column.id}-${issue.id}-${index}`}
                          draggableId={issue.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                transition-all duration-300 ease-out
                                ${snapshot.isDragging 
                                  ? "rotate-6 scale-110 shadow-2xl z-50 ring-4 ring-white/50 dark:ring-gray-800/50" 
                                  : "hover:scale-[1.02] hover:shadow-md"
                                }
                              `}
                            >
                              <IssueCard
                                issue={issue}
                                onClick={() => handleIssueClick(issue)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Connecting Lines */}
                {index < statusColumns.length - 1 && (
                  <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-current to-transparent opacity-20 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Create Issue Drawer */}
      <CreateIssueDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onIssueCreated={handleIssueCreated}
        projectId={projectId}
        sprintId={currentSprint?.id}
      />

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueCardDetails
          issue={selectedIssue}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onIssueUpdated={handleIssueUpdated}
          onIssueDeleted={handleIssueDeleted}
        />
      )}
    </div>
  );
};

export default SprintBoard;
