import Department, { DepartmentStatus } from "../models/Department";
import { Request, Response } from "express";

import User from "../models/User";

// @desc    Get all departments (Admin only)
// @route   GET /api/departments
// @access  Private/Admin
export const getAllDepartments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const departments = await Department.find(query)
      .populate("manager", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Department.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        departments,
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
    console.error("Get all departments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get department by ID (Admin only)
// @route   GET /api/departments/:id
// @access  Private/Admin
export const getDepartmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "manager",
      "firstName lastName email avatar role department position"
    );

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    // Get employees in this department
    const employees = await User.find({
      department: department.name,
      status: "active",
    }).select("firstName lastName email role position avatar");

    res.json({
      success: true,
      data: {
        department,
        employees,
      },
    });
  } catch (error) {
    console.error("Get department by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Create new department (Admin only)
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, manager, status, code, location, budget } =
      req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      res.status(400).json({
        success: false,
        message: "Department with this name already exists",
      });
      return;
    }

    // Check if code already exists
    if (code) {
      const existingCode = await Department.findOne({ code });
      if (existingCode) {
        res.status(400).json({
          success: false,
          message: "Department with this code already exists",
        });
        return;
      }
    }

    // Validate manager if provided
    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser) {
        res.status(400).json({
          success: false,
          message: "Manager user not found",
        });
        return;
      }

      if (managerUser.role !== "admin" && managerUser.role !== "manager") {
        res.status(400).json({
          success: false,
          message: "Manager must be an admin or manager user",
        });
        return;
      }
    }

    // Create new department
    const department = new Department({
      name,
      description,
      manager,
      status: status || DepartmentStatus.ACTIVE,
      code,
      location,
      budget: budget ? parseFloat(budget) : undefined,
    });

    await department.save();

    // Populate manager info
    await department.populate("manager", "firstName lastName email avatar");

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: {
        department,
      },
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update department (Admin only)
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, manager, status, code, location, budget } =
      req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    // Check if name already exists (excluding current department)
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        res.status(400).json({
          success: false,
          message: "Department with this name already exists",
        });
        return;
      }
    }

    // Check if code already exists (excluding current department)
    if (code && code !== department.code) {
      const existingCode = await Department.findOne({ code });
      if (existingCode) {
        res.status(400).json({
          success: false,
          message: "Department with this code already exists",
        });
        return;
      }
    }

    // Validate manager if provided
    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser) {
        res.status(400).json({
          success: false,
          message: "Manager user not found",
        });
        return;
      }

      if (managerUser.role !== "admin" && managerUser.role !== "manager") {
        res.status(400).json({
          success: false,
          message: "Manager must be an admin or manager user",
        });
        return;
      }
    }

    // Update department
    department.name = name || department.name;
    department.description =
      description !== undefined ? description : department.description;
    department.manager = manager !== undefined ? manager : department.manager;
    department.status = status || department.status;
    department.code = code !== undefined ? code : department.code;
    department.location =
      location !== undefined ? location : department.location;
    department.budget =
      budget !== undefined ? parseFloat(budget) : department.budget;

    await department.save();

    // Populate manager info
    await department.populate("manager", "firstName lastName email avatar");

    res.json({
      success: true,
      message: "Department updated successfully",
      data: {
        department,
      },
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete department (Admin only)
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    // Check if department has active employees
    const activeEmployees = await User.countDocuments({
      department: department.name,
      status: "active",
    });

    if (activeEmployees > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete department. It has ${activeEmployees} active employees. Please reassign or deactivate employees first.`,
      });
      return;
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get department statistics (Admin only)
// @route   GET /api/departments/stats
// @access  Private/Admin
export const getDepartmentStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await Department.getDepartmentStats();

    // Get departments with most employees
    const topDepartments = await Department.find()
      .sort({ employeeCount: -1 })
      .limit(5)
      .populate("manager", "firstName lastName email");

    // Get recent departments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDepartments = await Department.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        ...stats,
        topDepartments,
        recentDepartments,
      },
    });
  } catch (error) {
    console.error("Get department stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get active departments for dropdown (Admin only)
// @route   GET /api/departments/active
// @access  Private/Admin
export const getActiveDepartments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const departments = await Department.find({
      status: DepartmentStatus.ACTIVE,
    })
      .select("name code manager")
      .populate("manager", "firstName lastName email")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: {
        departments,
      },
    });
  } catch (error) {
    console.error("Get active departments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
