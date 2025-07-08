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
} from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { taskService, type TaskStats } from "@/utils/taskService";
import { useAuth } from "@/hooks/useAuth";

export const description = "Task statistics with pie chart and line graph";

// Sample line chart data for task completion trends
const lineChartData = [
  { date: "2024-01", completed: 12, created: 15, inProgress: 8 },
  { date: "2024-02", completed: 18, created: 22, inProgress: 12 },
  { date: "2024-03", completed: 25, created: 28, inProgress: 15 },
  { date: "2024-04", completed: 32, created: 35, inProgress: 18 },
  { date: "2024-05", completed: 28, created: 30, inProgress: 20 },
  { date: "2024-06", completed: 35, created: 38, inProgress: 22 },
  { date: "2024-07", completed: 42, created: 45, inProgress: 25 },
  { date: "2024-08", completed: 38, created: 42, inProgress: 28 },
  { date: "2024-09", completed: 45, created: 48, inProgress: 30 },
  { date: "2024-10", completed: 52, created: 55, inProgress: 32 },
  { date: "2024-11", completed: 48, created: 52, inProgress: 35 },
  { date: "2024-12", completed: 55, created: 58, inProgress: 38 },
];

const COLORS = {
  completed: "#10b981", // green
  inProgress: "#3b82f6", // blue
  pending: "#f59e0b", // amber
  overdue: "#ef4444", // red
};

export function TaskCharts() {
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

  // Filter line chart data based on time range
  const getFilteredLineData = () => {
    const months = timeRange === "12m" ? 12 : timeRange === "6m" ? 6 : 3;
    return lineChartData.slice(-months);
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
  const lineData = getFilteredLineData();

  console.log("Pie data:", pieData);
  console.log("Line data:", lineData);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>
            Current breakdown of tasks by status
          </CardDescription>
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
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Task Trends</CardTitle>
          <CardDescription>
            Monthly task completion and creation trends
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="12m">Last 12 months</ToggleGroupItem>
              <ToggleGroupItem value="6m">Last 6 months</ToggleGroupItem>
              <ToggleGroupItem value="3m">Last 3 months</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 12 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m" className="rounded-lg">
                  Last 12 months
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short" });
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke={COLORS.completed}
                strokeWidth={2}
                name="Completed"
                dot={{ fill: COLORS.completed, strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Created"
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke={COLORS.inProgress}
                strokeWidth={2}
                name="In Progress"
                dot={{ fill: COLORS.inProgress, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
