import {
  IconCalendar,
  IconEdit,
  IconEye,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import type { Task } from "@/utils/taskService";

interface AdminTaskRowProps {
  task: Task;
  onView: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
    case "in_progress":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "review":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "testing":
      return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
    case "done":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-slate-50 text-slate-600 border-slate-200";
    case "medium":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "high":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "urgent":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getPriorityBorder = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "border-l-red-500";
    case "high":
      return "border-l-orange-400";
    case "medium":
      return "border-l-blue-400";
    case "low":
      return "border-l-slate-300";
    default:
      return "border-l-slate-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const AdminTaskRow: React.FC<AdminTaskRowProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <TooltipProvider>
      <TableRow
        className={`group hover:bg-muted/30 transition-all duration-200 border-l-4 ${getPriorityBorder(
          task.priority
        )} ${task.priority === "urgent" ? "bg-red-50/30" : ""}`}
      >
        <TableCell className="py-6 px-4">
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium text-foreground truncate max-w-[200px] cursor-help">
                  {task.title}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{task.title}</p>
              </TooltipContent>
            </Tooltip>
            {task.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {task.description}
              </span>
            )}
          </div>
        </TableCell>

        <TableCell className="py-6 px-4">
          <Badge
            className={`${getStatusColor(
              task.status
            )} transition-colors duration-200 font-medium`}
          >
            {task.status.replace("_", " ")}
          </Badge>
        </TableCell>

        <TableCell className="py-6 px-4">
          <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
            {task.priority}
          </Badge>
        </TableCell>

        <TableCell className="py-6 px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 group/assignee">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconUser className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {task.assignee.firstName} {task.assignee.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {task.assignee.email}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Assigned to: {task.assignee.firstName} {task.assignee.lastName}
              </p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="py-6 px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 group/creator">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <IconUser className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {task.createdBy.firstName} {task.createdBy.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {task.createdBy.email}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Created by: {task.createdBy.firstName} {task.createdBy.lastName}
              </p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="py-6 px-4">
          {task.dueDate ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-2 ${
                    isOverdue(task.dueDate) ? "text-red-600" : ""
                  }`}
                >
                  <IconCalendar
                    className={`w-4 h-4 ${
                      isOverdue(task.dueDate)
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isOverdue(task.dueDate) ? "font-medium" : ""
                    }`}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                  {isOverdue(task.dueDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Due date: {formatDate(task.dueDate)}</p>
                {isOverdue(task.dueDate) && (
                  <p className="text-red-500">This task is overdue!</p>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </TableCell>

        <TableCell className="py-6 px-4">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => onView(task._id)}
                >
                  <IconEye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View task details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => onEdit(task._id)}
                >
                  <IconEdit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(task._id)}
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    </TooltipProvider>
  );
};

export default AdminTaskRow;
