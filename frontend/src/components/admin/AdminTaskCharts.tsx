"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { taskService, type TaskStats } from "@/utils/taskService";
import { useAuth } from "@/hooks/useAuth";

export const description =
  "Administrative task statistics with enhanced charts";

// Sample data for admin charts
const userActivityData = [
  { month: "Jan", activeUsers: 45, newUsers: 12, totalUsers: 120 },
  { month: "Feb", activeUsers: 52, newUsers: 8, totalUsers: 128 },
  { month: "Mar", activeUsers: 48, newUsers: 15, totalUsers: 143 },
  { month: "Apr", activeUsers: 61, newUsers: 10, totalUsers: 153 },
  { month: "May", activeUsers: 58, newUsers: 7, totalUsers: 160 },
  { month: "Jun", activeUsers: 67, newUsers: 13, totalUsers: 173 },
  { month: "Jul", activeUsers: 72, newUsers: 9, totalUsers: 182 },
  { month: "Aug", activeUsers: 69, newUsers: 11, totalUsers: 193 },
  { month: "Sep", activeUsers: 78, newUsers: 14, totalUsers: 207 },
  { month: "Oct", activeUsers: 85, newUsers: 12, totalUsers: 219 },
  { month: "Nov", activeUsers: 82, newUsers: 8, totalUsers: 227 },
  { month: "Dec", activeUsers: 89, newUsers: 6, totalUsers: 233 },
];

const systemPerformanceData = [
  { time: "00:00", cpu: 45, memory: 60, storage: 67 },
  { time: "04:00", cpu: 35, memory: 55, storage: 67 },
  { time: "08:00", cpu: 75, memory: 80, storage: 68 },
  { time: "12:00", cpu: 85, memory: 85, storage: 69 },
  { time: "16:00", cpu: 90, memory: 88, storage: 70 },
  { time: "20:00", cpu: 70, memory: 75, storage: 71 },
  { time: "24:00", cpu: 50, memory: 65, storage: 71 },
];

const COLORS = {
  completed: "#10b981", // green
  inProgress: "#3b82f6", // blue
  pending: "#f59e0b", // amber
  overdue: "#ef4444", // red
  activeUsers: "#3b82f6", // blue
  newUsers: "#10b981", // green
  cpu: "#ef4444", // red
  memory: "#f59e0b", // amber
  storage: "#8b5cf6", // purple
};

export function AdminTaskCharts() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = React.useState("12m");
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!isAuthenticated) {
        console.log("User not authenticated, using fallback data");
        setTaskStats({
          totalTasks: 38,
          pendingTasks: 12,
          inProgressTasks: 8,
          completedTasks: 15,
          overdueTasks: 3,
          priorityStats: [],
          typeStats: [],
          projectStats: [],
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching task stats...");
        const stats = await taskService.getTaskStats();
        console.log("Task stats received:", stats);
        setTaskStats(stats);
      } catch (err) {
        console.error("Failed to fetch task stats:", err);
        // Set some default data if API fails
        setTaskStats({
          totalTasks: 38,
          pendingTasks: 12,
          inProgressTasks: 8,
          completedTasks: 15,
          overdueTasks: 3,
          priorityStats: [],
          typeStats: [],
          projectStats: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("6m");
    }
  }, [isMobile]);

  // Filter user activity data based on time range
  const getFilteredUserData = () => {
    const months = timeRange === "12m" ? 12 : timeRange === "6m" ? 6 : 3;
    return userActivityData.slice(-months);
  };

  // Prepare pie chart data from task stats
  const getPieChartData = () => {
    if (!taskStats) {
      // Fallback data if API fails
      return [
        { name: "Completed", value: 15, color: COLORS.completed },
        { name: "In Progress", value: 8, color: COLORS.inProgress },
        { name: "Pending", value: 12, color: COLORS.pending },
        { name: "Overdue", value: 3, color: COLORS.overdue },
      ];
    }

    const completed = taskStats.completedTasks || 0;
    const inProgress = taskStats.inProgressTasks || 0;
    const total = taskStats.totalTasks || 0;
    const overdue = taskStats.overdueTasks || 0;
    const pending = Math.max(0, total - completed - inProgress);

    return [
      { name: "Completed", value: completed, color: COLORS.completed },
      { name: "In Progress", value: inProgress, color: COLORS.inProgress },
      { name: "Pending", value: pending, color: COLORS.pending },
      { name: "Overdue", value: overdue, color: COLORS.overdue },
    ].filter((item) => item.value > 0);
  };

  const pieData = getPieChartData();
  const userData = getFilteredUserData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
            <div className="h-6 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
            <div className="h-6 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Administrative Analytics</h3>
          <p className="text-sm text-muted-foreground">
            System-wide performance and user activity metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            className="grid w-auto grid-cols-3"
          >
            <ToggleGroupItem value="3m" size="sm">
              3M
            </ToggleGroupItem>
            <ToggleGroupItem value="6m" size="sm">
              6M
            </ToggleGroupItem>
            <ToggleGroupItem value="12m" size="sm">
              12M
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>
              Monthly user activity and growth patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke={COLORS.activeUsers}
                  strokeWidth={2}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke={COLORS.newUsers}
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>System-wide task status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>
              Real-time system resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={systemPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cpu" fill={COLORS.cpu} name="CPU Usage (%)" />
                <Bar
                  dataKey="memory"
                  fill={COLORS.memory}
                  name="Memory Usage (%)"
                />
                <Bar
                  dataKey="storage"
                  fill={COLORS.storage}
                  name="Storage Usage (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
