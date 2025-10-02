"use client";

import React, { useState, useEffect } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueInterface, IssueStatus, IssuePriority } from "@/interfaces/issueInterface";
import { issueSchema } from "@/lib/validators";
import { useFetch } from "@/hooks/use-fetch";
import { UpdateIssue, deleteIssue } from "@/actions/issues";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Zap, 
  Trash2, 
  Edit3, 
  Save,
  Calendar,
  User,
  Hash,
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";
import { toast } from "sonner";
import AssigneeSelector from "@/app/(main)/project/_components/assignee-selector";

interface IssueCardDetailsProps {
  issue: IssueInterface;
  isOpen: boolean;
  onClose: () => void;
  onIssueUpdated: (issue: IssueInterface) => void;
  onIssueDeleted: (issueId: string) => void;
}

const priorityOptions = [
  {
    value: IssuePriority.LOW,
    label: "Low",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: ArrowDown,
  },
  {
    value: IssuePriority.MEDIUM,
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: Minus,
  },
  {
    value: IssuePriority.HIGH,
    label: "High",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    icon: ArrowUp,
  },
  {
    value: IssuePriority.URGENT,
    label: "Urgent",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    icon: Zap,
  },
];

const statusOptions = [
  { value: IssueStatus.TODO, label: "To Do", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  { value: IssueStatus.IN_PROGRESS, label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" },
  { value: IssueStatus.IN_REVIEW, label: "In Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" },
  { value: IssueStatus.DONE, label: "Done", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" },
];

type FormData = z.infer<typeof issueSchema>;

const IssueCardDetails: React.FC<IssueCardDetailsProps> = ({
  issue,
  isOpen,
  onClose,
  onIssueUpdated,
  onIssueDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: updatedIssue, isLoading: isUpdating, fn: updateIssue } = useFetch(UpdateIssue);
  const { data: deleteResult, isLoading: isDeleting, fn: deleteCurrentIssue } = useFetch(deleteIssue);

  const form = useForm<FormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description || "",
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assignee?.clerkUserId || "",
    },
  });

  // Update form when issue changes
  useEffect(() => {
    form.reset({
      title: issue.title,
      description: issue.description || "",
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assignee?.clerkUserId || "",
    });
  }, [issue.id, issue.title, issue.description, issue.status, issue.priority, issue.assignee?.clerkUserId, form.reset]);

  // Handle successful update
  useEffect(() => {
    if (updatedIssue) {
      onIssueUpdated(updatedIssue);
      setIsEditing(false);
      toast.success("Issue updated successfully!");
    }
  }, [updatedIssue, onIssueUpdated]);

  const onSubmit = async (data: FormData) => {
    const updateData = {
      title: data.title,
      description: data.description || "",
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || issue.assignee?.clerkUserId || null,
      id: issue.id,
      order: issue.order,
      sprintId: issue.sprintId,
      reporterId: issue.reporterId,
      projectId: issue.projectId,
    };

    await updateIssue(issue.id, updateData);
  };

  const handleDelete = async () => {
    await deleteCurrentIssue(issue.id);
    // Check if deletion was successful by checking if deleteResult is set
    if (deleteResult?.success) {
      onIssueDeleted(issue.id);
      toast.success("Issue deleted successfully!");
    }
    setShowDeleteConfirm(false);
  };

  // Handle successful deletion
  useEffect(() => {
    if (deleteResult?.success) {
      onIssueDeleted(issue.id);
      toast.success("Issue deleted successfully!");
      setShowDeleteConfirm(false);
    }
  }, [deleteResult, onIssueDeleted, issue.id]);

  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityInfo = priorityOptions.find(p => p.value === issue.priority);
  const statusInfo = statusOptions.find(s => s.value === issue.status);
  const PriorityIcon = priorityInfo?.icon || Minus;
  const currentPriority = priorityOptions.find(p => p.value === form.watch("priority"));
  const CurrentPriorityIcon = currentPriority?.icon || Minus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-hidden p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg shrink-0">
              <Hash className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono font-semibold text-primary">
                #{issue.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <Badge className={priorityInfo?.color} variant="secondary">
              <PriorityIcon className="h-3 w-3 mr-1.5" />
              {priorityInfo?.label}
            </Badge>
            <Badge variant="outline" className={statusInfo?.color}>
              {statusInfo?.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 mr-4">
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
          </div>
        </div>

        {/* Main Content - Optimized Layout */}
        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            <div className="p-6">
              <DialogTitle className="text-xl font-bold mb-6">Edit Issue</DialogTitle>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }: { field: ControllerRenderProps<FormData, "title"> }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10" placeholder="Enter issue title..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }: { field: ControllerRenderProps<FormData, "description"> }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="min-h-[100px] resize-none" 
                            placeholder="Describe the issue..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }: { field: ControllerRenderProps<FormData, "status"> }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }: { field: ControllerRenderProps<FormData, "priority"> }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Priority</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <AssigneeSelector
                      value={form.watch("assigneeId") || ""}
                      onValueChange={(value: string) => form.setValue("assigneeId", value || undefined)}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <BarLoader color="white" width={20} height={2} />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <DialogTitle className="text-xl font-bold leading-relaxed">
                  {issue.title}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {issue.createdAt && (
                    <span>Created {format(new Date(issue.createdAt), "MMM dd, yyyy")}</span>
                  )}
                  {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                    <span>• Updated {format(new Date(issue.updatedAt), "MMM dd, yyyy")}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-3">Description</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  {issue.description ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No description provided</p>
                  )}
                </div>
              </div>

              {/* People - Compact Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Assignee</h4>
                  {issue.assignee ? (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={issue.assignee.imageUrl || ""} alt={issue.assignee.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                          {getInitials(issue.assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{issue.assignee.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{issue.assignee.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-muted-foreground">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Unassigned</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Reporter</h4>
                  {issue.reporter ? (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={issue.reporter.imageUrl || ""} alt={issue.reporter.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-sm">
                          {getInitials(issue.reporter.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{issue.reporter.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{issue.reporter.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-muted-foreground">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>  
                      <span className="text-sm">No reporter</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg border shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Delete Issue?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                This will permanently delete "<strong className="text-foreground truncate inline-block max-w-[200px]">{issue.title}</strong>". This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IssueCardDetails;