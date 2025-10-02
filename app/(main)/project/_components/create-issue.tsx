"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueInterface, IssueStatus, IssuePriority } from "@/interfaces/issueInterface";
import { issueSchema } from "@/lib/validators";
import { useFetch } from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { BarLoader } from "react-spinners";
import { X, ArrowUp, ArrowDown, Minus, Zap } from "lucide-react";
import * as z from "zod";
import AssigneeSelector from "./assignee-selector";

interface CreateIssueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueCreated: (issue: IssueInterface) => void;
  projectId: string;
  sprintId?: string;
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
  { value: IssueStatus.TODO, label: "To Do" },
  { value: IssueStatus.IN_PROGRESS, label: "In Progress" },
  { value: IssueStatus.IN_REVIEW, label: "In Review" },
  { value: IssueStatus.DONE, label: "Done" },
];

type FormData = z.infer<typeof issueSchema>;

const CreateIssueDrawer: React.FC<CreateIssueDrawerProps> = ({
  isOpen,
  onClose,
  onIssueCreated,
  projectId,
  sprintId,
}) => {
  const { data: createdIssue, isLoading, error, fn: createNewIssue, clearError } = useFetch(createIssue);

  const form = useForm<FormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      description: "",
      status: IssueStatus.TODO,
      priority: IssuePriority.MEDIUM,
      assigneeId: "",
    },
  });

  // Handle successful issue creation
  useEffect(() => {
    if (createdIssue) {
      onIssueCreated(createdIssue);
      form.reset();
      onClose(); // Close the drawer on successful creation
    }
  }, [createdIssue, onIssueCreated, form, onClose]);

  // Clear error when drawer opens
  useEffect(() => {
    if (isOpen && clearError) {
      clearError();
    }
  }, [isOpen, clearError]);

  const onSubmit = async (data: FormData) => {
    // Clear any previous errors
    if (clearError) {
      clearError();
    }

    const issueData = {
      title: data.title,
      description: data.description || "",
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || undefined,
      sprintId: sprintId,
    };

    await createNewIssue(issueData, projectId, sprintId);
  };

  const handleClose = () => {
    form.reset();
    if (clearError) {
      clearError(); // Clear any existing errors when closing
    }
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-bold">Create New Issue</DrawerTitle>
                <DrawerDescription>
                  Add a new issue to track work in your project.
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter issue title..."
                          {...field}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the issue in detail..."
                          className="min-h-[120px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status, Priority, and Assignee Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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

                  {/* Priority */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
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

                  {/* Assignee */}
                  <AssigneeSelector
                    value={form.watch("assigneeId") || ""}
                    onValueChange={(value: string) => form.setValue("assigneeId", value || undefined)}
                  />
                </div>

                {/* Selected Priority Preview */}
                {form.watch("priority") && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    {(() => {
                      const selectedPriority = priorityOptions.find(
                        (p) => p.value === form.watch("priority")
                      );
                      if (selectedPriority) {
                        const Icon = selectedPriority.icon;
                        return (
                          <Badge className={selectedPriority.color}>
                            <Icon className="h-3 w-3 mr-1" />
                            {selectedPriority.label}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-center py-4">
                    <BarLoader color="#3b82f6" />
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md relative">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1">{error}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="h-auto p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <DrawerFooter className="px-0">
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Creating..." : "Create Issue"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssueDrawer;