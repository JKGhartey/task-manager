import mongoose, { Document, Schema } from "mongoose";

// Department status enum
export enum DepartmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

// Interface for Department document
export interface IDepartment extends Document {
  name: string;
  description?: string;
  manager?: mongoose.Types.ObjectId;
  status: DepartmentStatus;
  code?: string; // Department code/abbreviation
  location?: string;
  budget?: number;
  employeeCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Department model with static methods
export interface IDepartmentModel extends mongoose.Model<IDepartment> {
  findActiveDepartments(): mongoose.Query<IDepartment[], IDepartment>;
  findByManager(
    managerId: mongoose.Types.ObjectId
  ): mongoose.Query<IDepartment[], IDepartment>;
  findByStatus(
    status: DepartmentStatus
  ): mongoose.Query<IDepartment[], IDepartment>;
  getDepartmentStats(): Promise<{
    totalDepartments: number;
    activeDepartments: number;
    statusBreakdown: any[];
  }>;
}

// Department schema
const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function (value: mongoose.Types.ObjectId) {
          if (!value) return true; // Optional field
          const User = mongoose.model("User");
          const user = await User.findById(value);
          return user && (user.role === "admin" || user.role === "manager");
        },
        message: "Manager must be an admin or manager user",
      },
    },
    status: {
      type: String,
      enum: Object.values(DepartmentStatus),
      default: DepartmentStatus.ACTIVE,
    },
    code: {
      type: String,
      trim: true,
      maxlength: [10, "Department code cannot exceed 10 characters"],
      uppercase: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    employeeCount: {
      type: Number,
      min: [0, "Employee count cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes for better query performance
departmentSchema.index({ name: 1 });
departmentSchema.index({ status: 1 });
departmentSchema.index({ manager: 1 });
departmentSchema.index({ code: 1 });

// Pre-save middleware to update employee count
departmentSchema.pre("save", async function (next) {
  if (this.isModified("status") || this.isNew) {
    const User = mongoose.model("User");
    const count = await User.countDocuments({
      department: this.name,
      status: "active",
    });
    this.employeeCount = count;
  }
  next();
});

// Static method to find active departments
departmentSchema.statics.findActiveDepartments = function () {
  return this.find({ status: DepartmentStatus.ACTIVE });
};

// Static method to find departments by manager
departmentSchema.statics.findByManager = function (
  managerId: mongoose.Types.ObjectId
) {
  return this.find({ manager: managerId });
};

// Static method to find departments by status
departmentSchema.statics.findByStatus = function (status: DepartmentStatus) {
  return this.find({ status });
};

// Static method to get department statistics
departmentSchema.statics.getDepartmentStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalEmployees: { $sum: "$employeeCount" },
        avgBudget: { $avg: "$budget" },
      },
    },
  ]);

  const totalDepartments = await this.countDocuments();
  const activeDepartments = await this.countDocuments({
    status: DepartmentStatus.ACTIVE,
  });

  return {
    totalDepartments,
    activeDepartments,
    statusBreakdown: stats,
  };
};

// Export the model
const Department = mongoose.model<IDepartment, IDepartmentModel>(
  "Department",
  departmentSchema
);

export default Department;
