"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconActivity,
  IconArrowDown,
  IconArrowUp,
  IconChartBar,
  IconChartLine,
  IconDownload,
  IconRefresh,
  IconUsers,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AnalyticsMetric {
  name: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
}

interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export default function SystemAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock analytics data
  const [metrics] = useState<AnalyticsMetric[]>([
    {
      name: "Total Users",
      value: 15420,
      change: 12.5,
      changeType: "increase",
      period: "vs last month",
    },
    {
      name: "Active Sessions",
      value: 1247,
      change: 8.2,
      changeType: "increase",
      period: "vs last week",
    },
    {
      name: "Tasks Completed",
      value: 8923,
      change: 15.3,
      changeType: "increase",
      period: "vs last month",
    },
    {
      name: "System Load",
      value: 67.2,
      change: 3.1,
      changeType: "decrease",
      period: "vs last week",
    },
  ]);

  // Chart data for user activity
  const [userActivityData] = useState<ChartDataPoint[]>([
    { name: "Mon", activeUsers: 1200, newUsers: 45, sessions: 1800 },
    { name: "Tue", activeUsers: 1350, newUsers: 52, sessions: 2100 },
    { name: "Wed", activeUsers: 1100, newUsers: 38, sessions: 1650 },
    { name: "Thu", activeUsers: 1400, newUsers: 61, sessions: 2200 },
    { name: "Fri", activeUsers: 1600, newUsers: 58, sessions: 2400 },
    { name: "Sat", activeUsers: 1800, newUsers: 67, sessions: 2700 },
    { name: "Sun", activeUsers: 1500, newUsers: 72, sessions: 2250 },
  ]);

  // Chart data for task completion
  const [taskCompletionData] = useState<ChartDataPoint[]>([
    { name: "Jan", completed: 1200, inProgress: 800, pending: 600 },
    { name: "Feb", completed: 1350, inProgress: 900, pending: 550 },
    { name: "Mar", completed: 1100, inProgress: 750, pending: 700 },
    { name: "Apr", completed: 1400, inProgress: 950, pending: 500 },
    { name: "May", completed: 1600, inProgress: 1000, pending: 400 },
    { name: "Jun", completed: 1800, inProgress: 1100, pending: 300 },
  ]);

  // Chart data for system performance
  const [systemPerformanceData] = useState<ChartDataPoint[]>([
    { name: "00:00", cpu: 45, memory: 60, storage: 67 },
    { name: "04:00", cpu: 35, memory: 55, storage: 67 },
    { name: "08:00", cpu: 75, memory: 80, storage: 68 },
    { name: "12:00", cpu: 85, memory: 85, storage: 69 },
    { name: "16:00", cpu: 90, memory: 88, storage: 70 },
    { name: "20:00", cpu: 70, memory: 75, storage: 71 },
  ]);

  // Chart data for device usage
  const [deviceUsageData] = useState<ChartDataPoint[]>([
    { name: "Desktop", value: 45, color: "#3b82f6", users: 6939 },
    { name: "Mobile", value: 35, color: "#10b981", users: 5397 },
    { name: "Tablet", value: 15, color: "#f59e0b", users: 2313 },
    { name: "Other", value: 5, color: "#8b5cf6", users: 771 },
  ]);

  // Chart colors
  const COLORS = {
    activeUsers: "#3b82f6",
    newUsers: "#10b981",
    sessions: "#8b5cf6",
    completed: "#10b981",
    inProgress: "#3b82f6",
    pending: "#f59e0b",
    cpu: "#ef4444",
    memory: "#f59e0b",
    storage: "#8b5cf6",
  };

  const [topUsers] = useState([
    { name: "John Doe", tasks: 45, hours: 32.5, efficiency: 94 },
    { name: "Jane Smith", tasks: 38, hours: 28.2, efficiency: 89 },
    { name: "Mike Johnson", tasks: 42, hours: 35.1, efficiency: 87 },
    { name: "Sarah Wilson", tasks: 35, hours: 26.8, efficiency: 92 },
    { name: "David Brown", tasks: 40, hours: 30.4, efficiency: 85 },
  ]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "increase" ? (
      <IconArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <IconArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeColor = (changeType: string) => {
    return changeType === "increase" ? "text-green-600" : "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              System Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive system performance and usage analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <IconRefresh
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.name} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                {metric.name === "Total Users" && (
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                )}
                {metric.name === "Active Sessions" && (
                  <IconActivity className="h-4 w-4 text-muted-foreground" />
                )}
                {metric.name === "Tasks Completed" && (
                  <IconChartBar className="h-4 w-4 text-muted-foreground" />
                )}
                {metric.name === "System Load" && (
                  <IconChartLine className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value.toLocaleString()}
                  {metric.name === "System Load" && "%"}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {getChangeIcon(metric.changeType)}
                  <span className={getChangeColor(metric.changeType)}>
                    {metric.change}%
                  </span>
                  <span className="text-muted-foreground">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">User Activity</TabsTrigger>
            <TabsTrigger value="tasks">Task Completion</TabsTrigger>
            <TabsTrigger value="performance">System Performance</TabsTrigger>
            <TabsTrigger value="users">Top Users</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">User Activity Trends</CardTitle>
                <CardDescription>
                  Daily active user patterns over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke={COLORS.activeUsers}
                        strokeWidth={2}
                        dot={{ fill: COLORS.activeUsers, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Active Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke={COLORS.newUsers}
                        strokeWidth={2}
                        dot={{ fill: COLORS.newUsers, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="New Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke={COLORS.sessions}
                        strokeWidth={2}
                        dot={{ fill: COLORS.sessions, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Sessions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Task Completion Analytics
                </CardTitle>
                <CardDescription>
                  Monthly task completion trends and productivity metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        fill={COLORS.completed}
                        name="Completed"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="inProgress"
                        fill={COLORS.inProgress}
                        name="In Progress"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="pending"
                        fill={COLORS.pending}
                        name="Pending"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">System Performance</CardTitle>
                <CardDescription>
                  Real-time system resource utilization and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={systemPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke={COLORS.cpu}
                        fill={COLORS.cpu}
                        fillOpacity={0.6}
                        name="CPU Usage"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="1"
                        stroke={COLORS.memory}
                        fill={COLORS.memory}
                        fillOpacity={0.6}
                        name="Memory Usage"
                      />
                      <Area
                        type="monotone"
                        dataKey="storage"
                        stackId="1"
                        stroke={COLORS.storage}
                        fill={COLORS.storage}
                        fillOpacity={0.6}
                        name="Storage Usage"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Top Performing Users
                    </CardTitle>
                    <CardDescription>
                      Users with highest task completion and efficiency rates
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <IconDownload className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div
                      key={user.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.tasks} tasks completed
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="font-medium">{user.hours}h</span>
                          <span className="text-muted-foreground ml-1">
                            worked
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {user.efficiency}%
                          </span>
                          <span className="text-muted-foreground ml-1">
                            efficiency
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            user.efficiency >= 90
                              ? "bg-green-100 text-green-800 border-green-200"
                              : user.efficiency >= 80
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {user.efficiency >= 90
                            ? "Excellent"
                            : user.efficiency >= 80
                            ? "Good"
                            : "Average"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Geographic Distribution</CardTitle>
              <CardDescription>
                User activity by geographic location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">United States</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Europe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asia Pacific</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Device Usage</CardTitle>
              <CardDescription className="text-base">
                User access patterns by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceUsageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color as string}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Usage"]}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
