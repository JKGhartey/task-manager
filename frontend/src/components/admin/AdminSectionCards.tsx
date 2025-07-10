"use client";

import { useEffect, useState } from "react";
import {
  IconUsers,
  IconShieldCheck,
  IconActivity,
  IconAlertTriangle,
  IconTrendingUp,
  IconDatabase,
  IconSettings,
  IconFolder,
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
import { getAllTeams } from "@/utils/teamService";
import { getAllProjects } from "@/utils/projectService";
import { useUserStats } from "@/hooks/useUsers";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  totalTeams: number;
  totalProjects: number;
  systemHealth: number;
  pendingApprovals: number;
  systemAlerts: number;
  storageUsage: number;
  uptime: number;
}

export function AdminSectionCards() {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the user stats hook
  const {
    stats: userStats,
    loading: userStatsLoading,
    error: userStatsError,
  } = useUserStats();

  // Debug logging
  console.log("User stats:", userStats);
  console.log("User stats loading:", userStatsLoading);
  console.log("User stats error:", userStatsError);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [taskData, teams, projects] = await Promise.all([
          taskService.getTaskStats(),
          getAllTeams(),
          getAllProjects(),
        ]);

        setTaskStats(taskData);
        setAdminStats({
          totalUsers: userStats?.totalUsers || 0,
          activeUsers: userStats?.statusBreakdown.active || 0,
          totalTasks: taskData.totalTasks || 0,
          totalTeams: teams.length,
          totalProjects: projects.length,
          systemHealth: 98,
          pendingApprovals: 12,
          systemAlerts: 3,
          storageUsage: 67,
          uptime: 99.9,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError("Failed to load administrative statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userStats]);

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (error || !adminStats) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card col-span-full">
          <CardHeader>
            <CardDescription>Error</CardDescription>
            <CardTitle className="text-lg text-destructive">
              {error || "Failed to load administrative statistics"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Team Management Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Team Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adminStats.totalTeams}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              <IconUsers className="size-3" />
              Active Teams
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Team collaboration <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">User assignment enabled</div>
        </CardFooter>
      </Card>

      {/* Project Management Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Project Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adminStats.totalProjects}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              <IconFolder className="size-3" />
              Active Projects
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-orange-600">
            Task organization <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Project-based workflow</div>
        </CardFooter>
      </Card>

      {/* System Health Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>System Health</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adminStats.systemHealth}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`${
                adminStats.systemHealth >= 90
                  ? "text-green-600 border-green-200"
                  : adminStats.systemHealth >= 70
                  ? "text-yellow-600 border-yellow-200"
                  : "text-red-600 border-red-200"
              }`}
            >
              <IconActivity className="size-3" />
              {adminStats.systemHealth >= 90
                ? "Excellent"
                : adminStats.systemHealth >= 70
                ? "Good"
                : "Warning"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            {adminStats.uptime}% uptime <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {adminStats.systemAlerts} active alerts
          </div>
        </CardFooter>
      </Card>

      {/* Task Management Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Task Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adminStats.totalTasks}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              <IconDatabase className="size-3" />
              All Tasks
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-purple-600">
            System-wide task management <IconSettings className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {taskStats?.completedTasks || 0} completed
          </div>
        </CardFooter>
      </Card>

      {/* Administrative Actions Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Actions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adminStats.pendingApprovals}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              <IconShieldCheck className="size-3" />
              Approvals
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-orange-600">
            {adminStats.pendingApprovals} pending approvals{" "}
            <IconAlertTriangle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {adminStats.storageUsage}% storage used
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
