import { Request, Response } from "express";
import Task, { TaskPriority, TaskStatus, TaskType } from "../models/Task";

import User from "../models/User";

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const type = req.query.type as string;
    const assignee = req.query.assignee as string;
    const createdBy = req.query.createdBy as string;
    const project = req.query.project as string;
    const department = req.query.department as string;
    const isPublic = req.query.isPublic as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { project: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if (assignee) query.assignee = assignee;
    if (createdBy) query.createdBy = createdBy;
    if (project) query.project = { $regex: project, $options: "i" };
    if (department) query.department = { $regex: department, $options: "i" };
    if (isPublic !== undefined) query.isPublic = isPublic === "true";

    const tasks = await Task.find(query)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      )
      .populate("comments.user", "firstName lastName email avatar");

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      priority,
      assignee,
      project,
      department,
      dueDate,
      estimatedHours,
      tags,
      isPublic,
    } = req.body;

    // Validate assignee exists
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser) {
      res.status(400).json({
        success: false,
        message: "Assignee not found",
      });
      return;
    }

    const task = new Task({
      title,
      description,
      type: type || TaskType.FEATURE,
      priority: priority || TaskPriority.MEDIUM,
      assignee,
      createdBy: (req as any).user.userId,
      project,
      department,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedHours,
      tags: tags || [],
      isPublic: isPublic || false,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task: populatedTask },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      priority,
      assignee,
      project,
      department,
      dueDate,
      estimatedHours,
      actualHours,
      tags,
      isPublic,
    } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check if user can update this task
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (
      userRole !== "admin" &&
      userRole !== "manager" &&
      task.createdBy.toString() !== userId &&
      task.assignee.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
      return;
    }

    // Validate assignee if being changed
    if (assignee && assignee !== task.assignee.toString()) {
      const assigneeUser = await User.findById(assignee);
      if (!assigneeUser) {
        res.status(400).json({
          success: false,
          message: "Assignee not found",
        });
        return;
      }
      task.assignee = assignee;
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (type) task.type = type;
    if (priority) task.priority = priority;
    if (project) task.project = project;
    if (department) task.department = department;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;
    if (tags) task.tags = tags;
    if (isPublic !== undefined) task.isPublic = isPublic;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      );

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check if user can delete this task
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (
      userRole !== "admin" &&
      userRole !== "manager" &&
      task.createdBy.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check if user can update this task
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (
      userRole !== "admin" &&
      userRole !== "manager" &&
      task.createdBy.toString() !== userId &&
      task.assignee.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
      return;
    }

    task.status = status;

    // Set completion date if task is done
    if (status === TaskStatus.Done && !task.completedDate) {
      task.completedDate = new Date();
    }

    // Update progress based on status
    await task.updateProgress();

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      );

    res.json({
      success: true,
      message: "Task status updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    await task.addComment((req as any).user.userId, content);

    const updatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      )
      .populate("comments.user", "firstName lastName email avatar");

    res.json({
      success: true,
      message: "Comment added successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
// @access  Private
export const addSubtask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Subtask title is required",
      });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    await task.addSubtask(title, description);

    const updatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      );

    res.json({
      success: true,
      message: "Subtask added successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Complete subtask
// @route   PATCH /api/tasks/:id/subtasks/:subtaskIndex
// @access  Private
export const completeSubtask = async (req: Request, res: Response) => {
  try {
    const subtaskIndex = parseInt(req.params.subtaskIndex);

    if (isNaN(subtaskIndex) || subtaskIndex < 0) {
      res.status(400).json({
        success: false,
        message: "Valid subtask index is required",
      });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    if (subtaskIndex >= task.subtasks.length) {
      res.status(400).json({
        success: false,
        message: "Subtask index out of range",
      });
      return;
    }

    await task.completeSubtask(subtaskIndex, (req as any).user.userId);

    const updatedTask = await Task.findById(task._id)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      );

    res.json({
      success: true,
      message: "Subtask completed successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Complete subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get my tasks (assigned to current user)
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;

    const skip = (page - 1) * limit;

    // Build query for tasks assigned to current user
    const query: any = { assignee: (req as any).user.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get tasks created by me
// @route   GET /api/tasks/created-by-me
// @access  Private
export const getTasksCreatedByMe = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    // Build query for tasks created by current user
    const query: any = { createdBy: (req as any).user.userId };

    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate(
        "assignee",
        "firstName lastName email avatar department position"
      )
      .populate(
        "createdBy",
        "firstName lastName email avatar department position"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get tasks created by me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    console.log("Getting task stats...");
    console.log("User ID:", userId);
    console.log("User role:", userRole);

    let query: any = {};

    // If not admin or manager, only show stats for user's tasks
    if (userRole !== "admin" && userRole !== "manager") {
      query.$or = [{ assignee: userId }, { createdBy: userId }];
      console.log("Regular user query:", query);
    } else {
      console.log("Admin/Manager query - showing all tasks");
    }

    const totalTasks = await Task.countDocuments(query);
    console.log("Total tasks:", totalTasks);

    const pendingTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Pending,
    });
    console.log("Pending tasks:", pendingTasks);

    const inProgressTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.InProgress,
    });
    console.log("In progress tasks:", inProgressTasks);

    const completedTasks = await Task.countDocuments({
      ...query,
      status: TaskStatus.Done,
    });
    console.log("Completed tasks:", completedTasks);

    // Get tasks by priority
    const priorityStats = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    console.log("Priority stats:", priorityStats);

    // Get tasks by type
    const typeStats = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    console.log("Type stats:", typeStats);

    // Get tasks by project
    const projectStats = await Task.aggregate([
      { $match: { ...query, project: { $exists: true, $ne: null } } },
      { $group: { _id: "$project", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    console.log("Project stats:", projectStats);

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $nin: [TaskStatus.Done, TaskStatus.Cancelled] },
    });
    console.log("Overdue tasks:", overdueTasks);

    res.json({
      success: true,
      data: {
        totalTasks,
        statusBreakdown: {
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
        priorityStats,
        typeStats,
        projectStats,
        overdueTasks,
      },
    });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
