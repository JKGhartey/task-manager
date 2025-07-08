import { IUser, UserRole } from "./User";
import mongoose, { Document, Schema } from "mongoose";

// Task priority enum
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Task status enum
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  TESTING = "testing",
  DONE = "done",
  CANCELLED = "cancelled",
}

// Task type enum
export enum TaskType {
  FEATURE = "feature",
  BUG = "bug",
  IMPROVEMENT = "improvement",
  DOCUMENTATION = "documentation",
  MAINTENANCE = "maintenance",
}

// Interface for Task document
export interface ITask extends Document {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: mongoose.Types.ObjectId | IUser;
  createdBy: mongoose.Types.ObjectId | IUser;
  project?: string;
  department?: string;
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  comments: {
    user: mongoose.Types.ObjectId | IUser;
    content: string;
    timestamp: Date;
  }[];
  subtasks: {
    title: string;
    description?: string;
    completed: boolean;
    completedBy?: mongoose.Types.ObjectId | IUser;
    completedAt?: Date;
  }[];
  dependencies: mongoose.Types.ObjectId[];
  relatedTasks: mongoose.Types.ObjectId[];
  progress: number; // 0-100 percentage
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  updateProgress(): Promise<void>;
  addComment(userId: mongoose.Types.ObjectId, content: string): Promise<void>;
  addSubtask(title: string, description?: string): Promise<void>;
  completeSubtask(
    subtaskIndex: number,
    userId: mongoose.Types.ObjectId
  ): Promise<void>;
  addAttachment(filePath: string): Promise<void>;
  removeAttachment(filePath: string): Promise<void>;
}

// Task schema
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [2000, "Task description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      enum: Object.values(TaskType),
      default: TaskType.FEATURE,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task creator is required"],
    },
    project: {
      type: String,
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value <= new Date();
        },
        message: "Completion date cannot be in the future",
      },
    },
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
      max: [1000, "Estimated hours cannot exceed 1000"],
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
      max: [1000, "Actual hours cannot exceed 1000"],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, "Subtask title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [500, "Subtask description cannot exceed 500 characters"],
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        completedAt: {
          type: Date,
        },
      },
    ],
    dependencies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    relatedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret: any) {
        // Calculate progress based on subtasks if not manually set
        if (ret.subtasks && ret.subtasks.length > 0) {
          const completedSubtasks = ret.subtasks.filter(
            (subtask: any) => subtask.completed
          ).length;
          ret.calculatedProgress = Math.round(
            (completedSubtasks / ret.subtasks.length) * 100
          );
        }
        return ret;
      },
    },
  }
);

// Indexes for better query performance
taskSchema.index({ assignee: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ type: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ department: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ createdAt: 1 });

// Virtual for task age
taskSchema.virtual("age").get(function () {
  return Math.floor(
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for days until due
taskSchema.virtual("daysUntilDue").get(function () {
  if (!this.dueDate) return null;
  return Math.ceil(
    (this.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for overdue status
taskSchema.virtual("isOverdue").get(function () {
  return (
    this.dueDate && this.dueDate < new Date() && this.status !== TaskStatus.DONE
  );
});

// Pre-save middleware to update completion date
taskSchema.pre("save", function (next) {
  if (this.status === TaskStatus.DONE && !this.completedDate) {
    this.completedDate = new Date();
  }
  next();
});

// Instance method to update progress
taskSchema.methods.updateProgress = async function (): Promise<void> {
  if (this.subtasks && this.subtasks.length > 0) {
    const completedSubtasks = this.subtasks.filter(
      (subtask: any) => subtask.completed
    ).length;
    this.progress = Math.round(
      (completedSubtasks / this.subtasks.length) * 100
    );
  }
  await this.save();
};

// Instance method to add comment
taskSchema.methods.addComment = async function (
  userId: mongoose.Types.ObjectId,
  content: string
): Promise<void> {
  this.comments.push({
    user: userId,
    content,
    timestamp: new Date(),
  });
  await this.save();
};

// Instance method to add subtask
taskSchema.methods.addSubtask = async function (
  title: string,
  description?: string
): Promise<void> {
  this.subtasks.push({
    title,
    description,
    completed: false,
  });
  await this.save();
};

// Instance method to complete subtask
taskSchema.methods.completeSubtask = async function (
  subtaskIndex: number,
  userId: mongoose.Types.ObjectId
): Promise<void> {
  if (subtaskIndex >= 0 && subtaskIndex < this.subtasks.length) {
    this.subtasks[subtaskIndex].completed = true;
    this.subtasks[subtaskIndex].completedBy = userId;
    this.subtasks[subtaskIndex].completedAt = new Date();
    await this.updateProgress();
  }
};

// Instance method to add attachment
taskSchema.methods.addAttachment = async function (
  filePath: string
): Promise<void> {
  if (!this.attachments.includes(filePath)) {
    this.attachments.push(filePath);
    await this.save();
  }
};

// Instance method to remove attachment
taskSchema.methods.removeAttachment = async function (
  filePath: string
): Promise<void> {
  this.attachments = this.attachments.filter(
    (attachment: string) => attachment !== filePath
  );
  await this.save();
};

// Static method to find tasks by assignee
taskSchema.statics.findByAssignee = function (
  assigneeId: mongoose.Types.ObjectId
) {
  return this.find({ assignee: assigneeId }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to find tasks by status
taskSchema.statics.findByStatus = function (status: TaskStatus) {
  return this.find({ status }).populate("assignee", "firstName lastName email");
};

// Static method to find overdue tasks
taskSchema.statics.findOverdueTasks = function () {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: TaskStatus.DONE },
  }).populate("assignee", "firstName lastName email");
};

// Static method to find tasks by priority
taskSchema.statics.findByPriority = function (priority: TaskPriority) {
  return this.find({ priority }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to find tasks by project
taskSchema.statics.findByProject = function (project: string) {
  return this.find({ project }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to find tasks by department
taskSchema.statics.findByDepartment = function (department: string) {
  return this.find({ department }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to find tasks with tags
taskSchema.statics.findByTags = function (tags: string[]) {
  return this.find({ tags: { $in: tags } }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to find tasks created by user
taskSchema.statics.findByCreator = function (
  creatorId: mongoose.Types.ObjectId
) {
  return this.find({ createdBy: creatorId }).populate(
    "assignee",
    "firstName lastName email"
  );
};

// Static method to get task statistics
taskSchema.statics.getTaskStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalEstimatedHours: { $sum: { $ifNull: ["$estimatedHours", 0] } },
        totalActualHours: { $sum: { $ifNull: ["$actualHours", 0] } },
      },
    },
  ]);

  return stats;
};

// Export the model
const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
