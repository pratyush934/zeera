"use client";

import { CreateSprint } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuroraText } from "@/components/ui/aurora-text";
import { useFetch } from "@/hooks/use-fetch";
import { Sprint } from "@/interfaces/sprintInterface";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Loader2, Play, Timer, Zap } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Zod validation schema for sprint creation
const sprintSchema = z
  .object({
    name: z
      .string()
      .min(1, "Sprint name is required")
      .max(50, "Sprint name must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9\s-_]+$/,
        "Sprint name can only contain letters, numbers, spaces, hyphens, and underscores"
      ),
    startDate: z.date().refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Start date cannot be in the past"),
    endDate: z.date(),
  })
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type SprintFormData = z.infer<typeof sprintSchema>;

const SprintCreation = ({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}) => {
  const {
    data: createdSprint,
    error,
    isLoading,
    fn: createSprintFn,
  } = useFetch(CreateSprint);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    mode: "onChange",
  });

  const watchedName = watch("name");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const router = useRouter();
  // Auto-generate sprint name if empty
  useEffect(() => {
    if (!watchedName) {
      setValue("name", `${projectKey}-Sprint-${sprintKey}`);
    }
  }, [projectKey, sprintKey, setValue, watchedName]);

  // Handle successful sprint creation
  useEffect(() => {
    if (createdSprint) {
      toast.success("Sprint created successfully!");
      router.push(`/project/${projectId}`);
    }
  }, [createdSprint, router, projectId]);

  const onSubmit = async (data: SprintFormData) => {
    const sprintData: Sprint = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    await createSprintFn(sprintData, projectId);
  };

  // Handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      setValue("startDate", range.from, { shouldValidate: true });
    }
    if (range?.to) {
      setValue("endDate", range.to, { shouldValidate: true });
    }
  };

  // Handle cancel - reset form and navigate back
  const handleCancel = () => {
    reset();
    router.push(`/project/${projectId}`);
  };

  return (
    <div className="mb-20 flex flex-col items-center p-4">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-8">
        <AuroraText className="text-3xl font-bold">
          Create New Sprint
        </AuroraText>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Set up a new sprint for{" "}
          <span className="font-semibold">{projectTitle}</span> to organize your
          work and track progress.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>
            Sprint #{sprintKey} • {projectKey}
          </span>
        </div>
      </div>

      <div className="w-full max-w-none" style={{ width: "100%" }}>
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl" />

          <div className="relative p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Sprint Information Card - All on same line */}
              <div className="bg-gradient-to-r from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90 p-8 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  {/* Sprint Name Field - Increased size (5 columns) */}
                  <div className="space-y-3 lg:col-span-5">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
                        <Timer className="h-3.5 w-3.5 text-white" />
                      </div>
                      Sprint Name
                    </label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={`${projectKey}-Sprint-${sprintKey}`}
                      className={cn(
                        "h-12 text-base",
                        errors.name &&
                          "border-red-500 focus-visible:border-red-500"
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">•</span>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Date Selection - Keep as is (4 columns) */}
                  <div className="space-y-3 lg:col-span-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600">
                        <CalendarDays className="h-3.5 w-3.5 text-white" />
                      </div>
                      Sprint Timeline
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 text-left font-normal justify-start w-full",
                            !watchedStartDate &&
                              !watchedEndDate &&
                              "text-muted-foreground",
                            (errors.startDate || errors.endDate) &&
                              "border-red-500"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {watchedStartDate && watchedEndDate
                            ? `${watchedStartDate.toLocaleDateString()} - ${watchedEndDate.toLocaleDateString()}`
                            : watchedStartDate
                            ? `${watchedStartDate.toLocaleDateString()} - Select end date`
                            : "Select sprint dates"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4">
                          <div className="text-center mb-4">
                            <h4 className="font-semibold text-sm">
                              Select Sprint Timeline
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Choose start and end dates for your sprint
                            </p>
                          </div>
                          <DayPicker
                            mode="range"
                            selected={{
                              from: watchedStartDate,
                              to: watchedEndDate,
                            }}
                            onSelect={handleDateRangeSelect}
                            disabled={{ before: new Date() }}
                            classNames={{
                              chevron: "fill-blue-500",
                              range_start: "bg-blue-700",
                              range_end: "bg-blue-700",
                              range_middle: "bg-blue-400",
                              day_button: "border-none",
                              today: "border-2 border-blue-700",
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    {(errors.startDate || errors.endDate) && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">•</span>
                        {errors.startDate?.message || errors.endDate?.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button - Reduced size (3 columns) */}
                  <div className="lg:col-span-3">
                    <Button
                      type="submit"
                      disabled={!isValid || isLoading}
                      className="h-12 text-sm font-medium w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 mr-2" />
                          Create Sprint
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Sprint Duration Info - Below the main row */}
                {watchedStartDate && watchedEndDate && (
                  <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between gap-4">
                      {/* Duration Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-sm">
                          <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            Sprint Duration
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {watchedStartDate.toLocaleDateString()} -{" "}
                            {watchedEndDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Days Display */}
                      <div className="text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {Math.ceil(
                            (watchedEndDate.getTime() -
                              watchedStartDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Days
                        </div>
                      </div>

                      {/* Cancel Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 text-sm font-medium px-6"
                        disabled={isLoading}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-6 border border-red-200/50 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintCreation;
