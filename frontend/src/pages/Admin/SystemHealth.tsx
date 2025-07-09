"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconActivity,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconCpu,
  IconDatabase,
  IconNetwork,
  IconRefresh,
  IconServer,
  IconShield,
  IconWifi,
} from "@tabler/icons-react";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "degraded";
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

export default function SystemHealth() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in a real app, this would come from API calls
  const [systemMetrics] = useState<SystemMetric[]>([
    {
      name: "CPU Usage",
      value: 45,
      unit: "%",
      status: "healthy",
      trend: "stable",
    },
    {
      name: "Memory Usage",
      value: 72,
      unit: "%",
      status: "warning",
      trend: "up",
    },
    {
      name: "Disk Usage",
      value: 38,
      unit: "%",
      status: "healthy",
      trend: "stable",
    },
    {
      name: "Network Load",
      value: 23,
      unit: "%",
      status: "healthy",
      trend: "down",
    },
  ]);

  const [serviceStatuses] = useState<ServiceStatus[]>([
    {
      name: "Web Server",
      status: "online",
      responseTime: 120,
      uptime: 99.8,
      lastCheck: new Date(),
    },
    {
      name: "Database",
      status: "online",
      responseTime: 45,
      uptime: 99.9,
      lastCheck: new Date(),
    },
    {
      name: "File Storage",
      status: "online",
      responseTime: 89,
      uptime: 99.7,
      lastCheck: new Date(),
    },
    {
      name: "Email Service",
      status: "degraded",
      responseTime: 2500,
      uptime: 98.5,
      lastCheck: new Date(),
    },
    {
      name: "Authentication Service",
      status: "online",
      responseTime: 67,
      uptime: 99.9,
      lastCheck: new Date(),
    },
  ]);

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "Memory usage exceeded 70%",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: 2,
      type: "info",
      message: "Database backup completed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 3,
      type: "error",
      message: "Email service experiencing delays",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  ]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
      case "offline":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return <IconCheck className="w-4 h-4" />;
      case "warning":
      case "degraded":
        return <IconAlertCircle className="w-4 h-4" />;
      case "critical":
      case "offline":
        return <IconAlertCircle className="w-4 h-4" />;
      default:
        return <IconClock className="w-4 h-4" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <IconAlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <IconAlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <IconCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <IconActivity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
            <p className="text-muted-foreground text-lg">
              Monitor system performance and service status
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
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

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Health
              </CardTitle>
              <IconShield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground">
                All critical systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <IconClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <IconNetwork className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120ms</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">System Metrics</CardTitle>
            <CardDescription>Real-time performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {metric.name === "CPU Usage" && (
                        <IconCpu className="w-4 h-4" />
                      )}
                      {metric.name === "Memory Usage" && (
                        <IconServer className="w-4 h-4" />
                      )}
                      {metric.name === "Disk Usage" && (
                        <IconDatabase className="w-4 h-4" />
                      )}
                      {metric.name === "Network Load" && (
                        <IconWifi className="w-4 h-4" />
                      )}
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        metric.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(metric.status)}
                      <span className="capitalize">{metric.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current</span>
                      <span className="font-medium">
                        {metric.value}
                        {metric.unit}
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Service Status</CardTitle>
            <CardDescription>
              Current status of all system services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStatuses.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(service.status)} capitalize`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">
                        {service.responseTime}ms
                      </span>
                      <span className="ml-1">response</span>
                    </div>
                    <div>
                      <span className="font-medium">{service.uptime}%</span>
                      <span className="ml-1">uptime</span>
                    </div>
                    <div>{service.lastCheck.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Alerts</CardTitle>
            <CardDescription>
              Latest system notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
