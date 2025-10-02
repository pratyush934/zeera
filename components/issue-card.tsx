"use client";

import React from "react";
import { IssueInterface, IssueStatus, IssuePriority } from "@/interfaces/issueInterface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface IssueCardProps {
  issue: IssueInterface;
  onClick?: () => void;
}

const priorityConfig = {
  [IssuePriority.LOW]: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: ArrowDown,
  },
  [IssuePriority.MEDIUM]: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: Minus,
  },
  [IssuePriority.HIGH]: {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    icon: ArrowUp,
  },
  [IssuePriority.URGENT]: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    icon: Zap,
  },
};

const statusConfig = {
  [IssueStatus.TODO]: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: Circle,
  },
  [IssueStatus.IN_PROGRESS]: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: Clock,
  },
  [IssueStatus.IN_REVIEW]: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: AlertCircle,
  },
  [IssueStatus.DONE]: {
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: CheckCircle2,
  },
};

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const priorityInfo = priorityConfig[issue.priority];
  const statusInfo = statusConfig[issue.status];
  const PriorityIcon = priorityInfo.icon;
  const StatusIcon = statusInfo.icon;

  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <Card 
        className={`
          group cursor-pointer 
          bg-white/80 dark:bg-gray-800/80 
          backdrop-blur-sm
          border border-gray-200/60 dark:border-gray-700/60
          hover:border-primary/30 dark:hover:border-primary/30
          transition-all duration-300 ease-out
          hover:shadow-lg hover:shadow-primary/5
          hover:-translate-y-1
          hover:bg-white dark:hover:bg-gray-800
          rounded-lg
          overflow-hidden
          relative
        `}
        onClick={onClick}
      >
        {/* Priority Color Strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${priorityInfo.color.includes('red') ? 'bg-red-400' : priorityInfo.color.includes('orange') ? 'bg-orange-400' : priorityInfo.color.includes('yellow') ? 'bg-yellow-400' : 'bg-blue-400'}`} />
        
        <div className="p-4">
          {/* Header with Issue ID and Priority */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                <StatusIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-300">
                  #{issue.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
            
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="secondary" 
                  className={`
                    ${priorityInfo.color} 
                    font-medium text-xs px-2 py-1 
                    shadow-sm border-0
                    transition-all duration-200
                    group-hover:shadow-md
                  `}
                >
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {issue.priority.toLowerCase()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">
                Priority: {issue.priority}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors leading-5">
            {issue.title}
          </h4>

          {/* Description */}
          {issue.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-4">
              {issue.description}
            </p>
          )}

          {/* Footer with Assignee and Date */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            {/* Assignee */}
            <div className="flex items-center gap-2">
              {issue.assignee ? (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-md group-hover:bg-primary/5 transition-colors">
                      <Avatar className="h-6 w-6 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                        <AvatarImage 
                          src={issue.assignee?.imageUrl || ""} 
                          alt={issue.assignee?.name || ""} 
                        />
                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(issue.assignee?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-20">
                        {issue.assignee?.name?.split(' ')[0] || 'Assigned'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="text-center">
                      <p className="font-medium">{issue.assignee?.name}</p>
                      <p className="text-xs text-muted-foreground">{issue.assignee?.email}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-md opacity-60">
                      <Avatar className="h-6 w-6 ring-2 ring-white dark:ring-gray-800">
                        <AvatarFallback className="text-xs bg-gray-300 dark:bg-gray-600">?</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Unassigned
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    No assignee
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Created Date */}
            {issue.createdAt && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {format(new Date(issue.createdAt), "MMM dd")}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Created: {format(new Date(issue.createdAt), "PPP 'at' p")}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Reporter Badge (if different from assignee) */}
          {issue.reporter && issue.reporter.id !== issue.assignee?.id && (
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage 
                      src={issue.reporter?.imageUrl || ""} 
                      alt={issue.reporter?.name || ""} 
                    />
                    <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-600">
                      {getInitials(issue.reporter?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Reported by {issue.reporter?.name?.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-lg" />
      </Card>
    </TooltipProvider>
  );
};

export default IssueCard;