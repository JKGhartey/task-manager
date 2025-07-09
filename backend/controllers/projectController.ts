import { Request, Response } from "express";

import Project from "../models/Project";
import Task from "../models/Task";
import Team from "../models/Team";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin/Manager
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate("tasks", "title description status priority")
      .populate("team", "name description");
    res.json({ success: true, data: { projects } });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private/Admin/Manager
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("tasks", "title description status priority assignee")
      .populate("team", "name description members");
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, data: { project } });
  } catch (error) {
    console.error("Get project by ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin/Manager
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, team, tasks } = req.body;
    // Check if project already exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: "Project with this name already exists",
      });
    }
    // Validate team if provided
    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return res
          .status(400)
          .json({ success: false, message: "Team not found" });
      }
    }
    // Validate tasks if provided
    let taskIds = [];
    if (tasks && tasks.length > 0) {
      const existingTasks = await Task.find({ _id: { $in: tasks } });
      if (existingTasks.length !== tasks.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more tasks not found" });
      }
      taskIds = tasks;
    }
    const project = new Project({ name, description, team, tasks: taskIds });
    await project.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin/Manager
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, team, tasks } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (team !== undefined) {
      if (team) {
        const teamExists = await Team.findById(team);
        if (!teamExists) {
          return res
            .status(400)
            .json({ success: false, message: "Team not found" });
        }
      }
      project.team = team;
    }
    if (tasks) {
      // Validate tasks
      const existingTasks = await Task.find({ _id: { $in: tasks } });
      if (existingTasks.length !== tasks.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more tasks not found" });
      }
      project.tasks = tasks;
    }
    await project.save();
    res.json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin/Manager
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Assign task to project
// @route   POST /api/projects/:id/assign-task
// @access  Private/Admin/Manager
export const assignTaskToProject = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    if (!project.tasks.includes(taskId)) {
      project.tasks.push(taskId);
      await project.save();
    }
    // Update task's project reference
    (task as any).project = project._id;
    await task.save();
    res.json({
      success: true,
      message: "Task assigned to project",
      data: { project },
    });
  } catch (error) {
    console.error("Assign task to project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Remove task from project
// @route   POST /api/projects/:id/remove-task
// @access  Private/Admin/Manager
export const removeTaskFromProject = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    project.tasks = project.tasks.filter((id: any) => id.toString() !== taskId);
    await project.save();
    // Remove project reference from task
    (task as any).project = null;
    await task.save();
    res.json({
      success: true,
      message: "Task removed from project",
      data: { project },
    });
  } catch (error) {
    console.error("Remove task from project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};
