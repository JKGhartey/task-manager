import { Request, Response } from "express";

import Team from "../models/Team";
import User from "../models/User";

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private/Admin/Manager
export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate(
      "members",
      "firstName lastName email role avatar"
    );
    res.json({ success: true, data: { teams } });
  } catch (error) {
    console.error("Get all teams error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private/Admin/Manager
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "firstName lastName email role avatar"
    );
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.json({ success: true, data: { team } });
  } catch (error) {
    console.error("Get team by ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private/Admin/Manager
export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;
    // Check if team already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team with this name already exists",
      });
    }
    // Validate members
    let memberIds = [];
    if (members && members.length > 0) {
      const users = await User.find({ _id: { $in: members } });
      if (users.length !== members.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more users not found" });
      }
      memberIds = members;
    }
    const team = new Team({ name, description, members: memberIds });
    await team.save();
    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: { team },
    });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private/Admin/Manager
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    if (name) team.name = name;
    if (description !== undefined) team.description = description;
    if (members) {
      // Validate members
      const users = await User.find({ _id: { $in: members } });
      if (users.length !== members.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more users not found" });
      }
      team.members = members;
    }
    await team.save();
    res.json({
      success: true,
      message: "Team updated successfully",
      data: { team },
    });
  } catch (error) {
    console.error("Update team error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private/Admin/Manager
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    console.error("Delete team error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Assign user to team
// @route   POST /api/teams/:id/assign-user
// @access  Private/Admin/Manager
export const assignUserToTeam = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }
    // Add team to user's teams if not already present
    const userTeams = user.teams
      ? (user.teams as unknown as import("mongoose").Types.ObjectId[])
      : [];
    if (
      !userTeams.some((id) =>
        id.equals(team._id as import("mongoose").Types.ObjectId)
      )
    ) {
      userTeams.push(team._id as import("mongoose").Types.ObjectId);
      user.teams = userTeams as any;
      await user.save();
    }
    res.json({
      success: true,
      message: "User assigned to team",
      data: { team },
    });
  } catch (error) {
    console.error("Assign user to team error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};

// @desc    Remove user from team
// @route   POST /api/teams/:id/remove-user
// @access  Private/Admin/Manager
export const removeUserFromTeam = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    team.members = team.members.filter((id: any) => id.toString() !== userId);
    await team.save();
    // Remove team from user's teams
    if (user.teams) {
      const userTeams =
        user.teams as unknown as import("mongoose").Types.ObjectId[];
      user.teams = userTeams.filter(
        (id) => !id.equals(team._id as import("mongoose").Types.ObjectId)
      ) as any;
      await user.save();
    }
    res.json({
      success: true,
      message: "User removed from team",
      data: { team },
    });
  } catch (error) {
    console.error("Remove user from team error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  return;
};
