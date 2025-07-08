import { Request, Response } from "express";
import Task, { TaskPriority, TaskStatus, TaskType } from "../models/Task";
import User, { UserRole, UserStatus } from "../models/User";

// @desc    Get dashboard overview
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    // Base query - admin sees all, others see their own data
    let taskQuery: any = {};
    let userQuery: any = {};

    if (userRole !== "admin") {
      taskQuery.$or = [{ assignee: userId }, { createdBy: userId }];
    }

    // Task statistics
    const totalTasks = await Task.countDocuments(taskQuery);
    const pendingTasks = await Task.countDocuments({
      ...taskQuery,
      status: TaskStatus.Pending,
    });
    const inProgressTasks = await Task.countDocuments({
      ...taskQuery,
      status: TaskStatus.InProgress,
    });
    const completedTasks = await Task.countDocuments({
      ...taskQuery,
      status: TaskStatus.Done,
    });
    const overdueTasks = await Task.countDocuments({
      ...taskQuery,
      dueDate: { $lt: new Date() },
      status: { $nin: [TaskStatus.Done, TaskStatus.Cancelled] },
    });

    // User statistics (admin only)
    let userStats = null;
    if (userRole === "admin") {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({
        status: UserStatus.ACTIVE,
      });
      const newUsersThisMonth = await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      });
      userStats = { totalUsers, activeUsers, newUsersThisMonth };
    }

    // Recent activity
    const recentTasks = await Task.find(taskQuery)
      .populate("assignee", "firstName lastName email avatar")
      .populate("createdBy", "firstName lastName email avatar")
      .sort({ updatedAt: -1 })
      .limit(5);

    // Performance metrics
    const thisMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const lastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );

    const tasksThisMonth = await Task.countDocuments({
      ...taskQuery,
      createdAt: { $gte: thisMonth },
    });

    const tasksLastMonth = await Task.countDocuments({
      ...taskQuery,
      createdAt: { $gte: lastMonth, $lt: thisMonth },
    });

    const completedThisMonth = await Task.countDocuments({
      ...taskQuery,
      status: TaskStatus.Done,
      completedDate: { $gte: thisMonth },
    });

    const completedLastMonth = await Task.countDocuments({
      ...taskQuery,
      status: TaskStatus.Done,
      completedDate: { $gte: lastMonth, $lt: thisMonth },
    });

    res.json({
      success: true,
      data: {
        taskStats: {
          total: totalTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          overdue: overdueTasks,
        },
        userStats,
        recentActivity: recentTasks,
        performance: {
          tasksThisMonth,
          tasksLastMonth,
          completedThisMonth,
          completedLastMonth,
          completionRate:
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get task analytics report
// @route   GET /api/reports/task-analytics
// @access  Private
export const getTaskAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    let query: any = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (userRole !== "admin") {
      query.$or = [{ assignee: userId }, { createdBy: userId }];
    }

    // Tasks by status
    const statusBreakdown = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Tasks by priority
    const priorityBreakdown = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Tasks by type
    const typeBreakdown = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Tasks by project
    const projectBreakdown = await Task.aggregate([
      { $match: { ...query, project: { $exists: true, $ne: null } } },
      { $group: { _id: "$project", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Tasks by department
    const departmentBreakdown = await Task.aggregate([
      { $match: { ...query, department: { $exists: true, $ne: null } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly trend
    const monthlyTrend = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Completion time analysis
    const completionTimeAnalysis = await Task.aggregate([
      {
        $match: {
          ...query,
          status: TaskStatus.Done,
          completedDate: { $exists: true },
        },
      },
      {
        $addFields: {
          completionTime: {
            $divide: [
              { $subtract: ["$completedDate", "$createdAt"] },
              1000 * 60 * 60 * 24, // Convert to days
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgCompletionTime: { $avg: "$completionTime" },
          minCompletionTime: { $min: "$completionTime" },
          maxCompletionTime: { $max: "$completionTime" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        statusBreakdown,
        priorityBreakdown,
        typeBreakdown,
        projectBreakdown,
        departmentBreakdown,
        monthlyTrend,
        completionTimeAnalysis: completionTimeAnalysis[0] || null,
      },
    });
  } catch (error) {
    console.error("Get task analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get user performance report
// @route   GET /api/reports/user-performance
// @access  Private/Admin
export const getUserPerformance = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user.role;
    if (userRole !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
      return;
    }

    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    // Get all users with their task statistics
    const users = await User.find({ status: UserStatus.ACTIVE }).select(
      "firstName lastName email role department position avatar"
    );

    const userPerformance = await Promise.all(
      users.map(async (user) => {
        // Tasks assigned to user
        const assignedTasks = await Task.countDocuments({
          assignee: user._id,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        // Tasks completed by user
        const completedTasks = await Task.countDocuments({
          assignee: user._id,
          status: TaskStatus.Done,
          completedDate: { $gte: startDate, $lte: endDate },
        });

        // Tasks created by user
        const createdTasks = await Task.countDocuments({
          createdBy: user._id,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        // Overdue tasks
        const overdueTasks = await Task.countDocuments({
          assignee: user._id,
          dueDate: { $lt: new Date() },
          status: { $nin: [TaskStatus.Done, TaskStatus.Cancelled] },
        });

        // Average completion time
        const completionTimeData = await Task.aggregate([
          {
            $match: {
              assignee: user._id,
              status: TaskStatus.Done,
              completedDate: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $addFields: {
              completionTime: {
                $divide: [
                  { $subtract: ["$completedDate", "$createdAt"] },
                  1000 * 60 * 60 * 24, // Convert to days
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgCompletionTime: { $avg: "$completionTime" },
            },
          },
        ]);

        const avgCompletionTime = completionTimeData[0]?.avgCompletionTime || 0;

        return {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            department: user.department,
            position: user.position,
            avatar: user.avatar,
          },
          metrics: {
            assignedTasks,
            completedTasks,
            createdTasks,
            overdueTasks,
            completionRate:
              assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0,
            avgCompletionTime: Math.round(avgCompletionTime * 100) / 100, // Round to 2 decimal places
          },
        };
      })
    );

    // Sort by completion rate
    userPerformance.sort(
      (a, b) => b.metrics.completionRate - a.metrics.completionRate
    );

    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        userPerformance,
      },
    });
  } catch (error) {
    console.error("Get user performance error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get project report
// @route   GET /api/reports/project-report
// @access  Private
export const getProjectReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const projectName = req.query.project as string;

    if (!projectName) {
      res.status(400).json({
        success: false,
        message: "Project name is required",
      });
      return;
    }

    let query: any = { project: { $regex: projectName, $options: "i" } };

    if (userRole !== "admin") {
      query.$or = [{ assignee: userId }, { createdBy: userId }];
    }

    // Project overview
    const totalTasks = await Task.countDocuments(query);
    const pendingTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Pending,
    });
    const inProgressTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.InProgress,
    });
    const completedTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Done,
    });
    const overdueTasks = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $nin: [TaskStatus.Done, TaskStatus.Cancelled] },
    });

    // Tasks by assignee
    const tasksByAssignee = await Task.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "assignee",
          foreignField: "_id",
          as: "assigneeData",
        },
      },
      { $unwind: "$assigneeData" },
      {
        $group: {
          _id: "$assignee",
          assigneeName: {
            $first: {
              $concat: [
                "$assigneeData.firstName",
                " ",
                "$assigneeData.lastName",
              ],
            },
          },
          assigneeEmail: { $first: "$assigneeData.email" },
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", TaskStatus.Done] }, 1, 0] },
          },
        },
      },
      { $sort: { totalAssigned: -1 } },
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Tasks by type
    const tasksByType = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Timeline data
    const timelineData = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          tasksCreated: { $sum: 1 },
          tasksCompleted: {
            $sum: { $cond: [{ $eq: ["$status", TaskStatus.Done] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Recent tasks
    const recentTasks = await Task.find(query)
      .populate("assignee", "firstName lastName email avatar")
      .populate("createdBy", "firstName lastName email avatar")
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        projectName,
        overview: {
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
          completionRate:
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        },
        tasksByAssignee,
        tasksByPriority,
        tasksByType,
        timelineData,
        recentTasks,
      },
    });
  } catch (error) {
    console.error("Get project report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get department report
// @route   GET /api/reports/department-report
// @access  Private
export const getDepartmentReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const department = req.query.department as string;

    if (!department) {
      res.status(400).json({
        success: false,
        message: "Department name is required",
      });
      return;
    }

    let query: any = { department: { $regex: department, $options: "i" } };

    if (userRole !== "admin") {
      query.$or = [{ assignee: userId }, { createdBy: userId }];
    }

    // Department overview
    const totalTasks = await Task.countDocuments(query);
    const pendingTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Pending,
    });
    const inProgressTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.InProgress,
    });
    const completedTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Done,
    });

    // Users in department
    const departmentUsers = await User.find({
      department: { $regex: department, $options: "i" },
      status: UserStatus.ACTIVE,
    }).select("firstName lastName email role position avatar");

    // Tasks by user in department
    const tasksByUser = await Task.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "assignee",
          foreignField: "_id",
          as: "assigneeData",
        },
      },
      { $unwind: "$assigneeData" },
      {
        $group: {
          _id: "$assignee",
          assigneeName: {
            $first: {
              $concat: [
                "$assigneeData.firstName",
                " ",
                "$assigneeData.lastName",
              ],
            },
          },
          assigneeEmail: { $first: "$assigneeData.email" },
          assigneeRole: { $first: "$assigneeData.role" },
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", TaskStatus.Done] }, 1, 0] },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", TaskStatus.InProgress] }, 1, 0],
            },
          },
        },
      },
      { $sort: { totalAssigned: -1 } },
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Tasks by type
    const tasksByType = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly trend
    const monthlyTrend = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          tasksCreated: { $sum: 1 },
          tasksCompleted: {
            $sum: { $cond: [{ $eq: ["$status", TaskStatus.Done] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        department,
        overview: {
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          completionRate:
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        },
        departmentUsers,
        tasksByUser,
        tasksByPriority,
        tasksByType,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Get department report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Export report data
// @route   GET /api/reports/export
// @access  Private
export const exportReportData = async (req: Request, res: Response) => {
  try {
    const reportType = req.query.type as string;
    const format = (req.query.format as string) || "json";
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    if (!reportType) {
      res.status(400).json({
        success: false,
        message: "Report type is required",
      });
      return;
    }

    let data: any = {};

    switch (reportType) {
      case "task-analytics":
        data = await getTaskAnalyticsData(startDate, endDate);
        break;
      case "user-performance":
        data = await getUserPerformanceData(startDate, endDate);
        break;
      case "project-report":
        const projectName = req.query.project as string;
        if (!projectName) {
          res.status(400).json({
            success: false,
            message: "Project name is required for project report",
          });
          return;
        }
        data = await getProjectReportData(projectName);
        break;
      default:
        res.status(400).json({
          success: false,
          message: "Invalid report type",
        });
        return;
    }

    if (format === "csv") {
      // TODO: Implement CSV export
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${reportType}-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );
      res.send("CSV export not implemented yet");
    } else {
      res.json({
        success: true,
        data,
        exportInfo: {
          type: reportType,
          format,
          startDate,
          endDate,
          exportedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper functions for export
async function getTaskAnalyticsData(startDate: Date, endDate: Date) {
  const query = { createdAt: { $gte: startDate, $lte: endDate } };

  const statusBreakdown = await Task.aggregate([
    { $match: query },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const priorityBreakdown = await Task.aggregate([
    { $match: query },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  return { statusBreakdown, priorityBreakdown };
}

async function getUserPerformanceData(startDate: Date, endDate: Date) {
  const users = await User.find({ status: UserStatus.ACTIVE }).select(
    "firstName lastName email role department"
  );

  const userPerformance = await Promise.all(
    users.map(async (user) => {
      const assignedTasks = await Task.countDocuments({
        assignee: user._id,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const completedTasks = await Task.countDocuments({
        assignee: user._id,
        status: TaskStatus.Done,
        completedDate: { $gte: startDate, $lte: endDate },
      });

      return {
        user: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        department: user.department,
        assignedTasks,
        completedTasks,
        completionRate:
          assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0,
      };
    })
  );

  return userPerformance;
}

async function getProjectReportData(projectName: string) {
  const query = { project: { $regex: projectName, $options: "i" } };

  const totalTasks = await Task.countDocuments(query);
  const completedTasks = await Task.countDocuments({
    ...query,
    status: TaskStatus.Done,
  });

  const tasksByAssignee = await Task.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "users",
        localField: "assignee",
        foreignField: "_id",
        as: "assigneeData",
      },
    },
    { $unwind: "$assigneeData" },
    {
      $group: {
        _id: "$assignee",
        assigneeName: {
          $first: {
            $concat: ["$assigneeData.firstName", " ", "$assigneeData.lastName"],
          },
        },
        totalAssigned: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", TaskStatus.Done] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    projectName,
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    tasksByAssignee,
  };
}
