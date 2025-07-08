"use client";

import { useEffect, useState } from "react";
import {
  IconCheck,
  IconClock,
  IconExclamationCircle,
  IconListCheck,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { taskService, type TaskStats } from "@/utils/taskService";

export function SectionCards() {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        setLoading(true);
        const stats = await taskService.getTaskStats();
        setTaskStats(stats);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch task stats:", err);
        setError("Failed to load task statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !taskStats) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card col-span-full">
          <CardHeader>
            <CardDescription>Error</CardDescription>
            <CardTitle className="text-lg text-destructive">
              {error || "Failed to load task statistics"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Ensure we have valid numbers, defaulting to 0 if undefined/null
  const totalTasks = taskStats.totalTasks || 0;
  const completedTasks = taskStats.completedTasks || 0;
  const inProgressTasks = taskStats.inProgressTasks || 0;
  const overdueTasks = taskStats.overdueTasks || 0;
  const pendingTasks = taskStats.pendingTasks || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overduePercentage =
    totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTasks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconListCheck className="size-3" />
              All Tasks
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pendingTasks} pending, {inProgressTasks} in progress
          </div>
          <div className="text-muted-foreground">
            {completedTasks} completed tasks
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedTasks}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              <IconCheck className="size-3" />
              {completionRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            {completionRate}% completion rate{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {totalTasks - completedTasks} tasks remaining
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {inProgressTasks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <IconClock className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-blue-600">
            Currently being worked on <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {pendingTasks} tasks waiting to start
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overdue Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {overdueTasks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600 border-red-200">
              <IconExclamationCircle className="size-3" />
              {overduePercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-red-600">
            {overduePercentage}% overdue rate{" "}
            <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Past due date and not completed
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
