import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { taskService, type Task } from "@/utils/taskService";
import { useAuth } from "@/hooks/useAuth";
import { UserLayout } from "@/components/layouts/UserLayout";

const ViewTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchTask();
    }
  }, [id, isAuthenticated]);

  const fetchTask = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const taskData = await taskService.getTaskById(id);
      setTask(taskData);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!task) return;

    try {
      const updatedTask = await taskService.updateTaskStatus(
        task._id,
        newStatus
      );
      setTask(updatedTask);
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleAddComment = async () => {
    if (!task || !commentInput.trim()) return;

    try {
      const updatedTask = await taskService.addComment(
        task._id,
        commentInput.trim()
      );
      setTask(updatedTask);
      setCommentInput("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleAddSubtask = async () => {
    if (!task || !subtaskInput.trim()) return;

    try {
      const updatedTask = await taskService.addSubtask(
        task._id,
        subtaskInput.trim(),
        subtaskDescription.trim() || undefined
      );
      setTask(updatedTask);
      setSubtaskInput("");
      setSubtaskDescription("");
      toast.success("Subtask added successfully");
    } catch (error) {
      console.error("Failed to add subtask:", error);
      toast.error("Failed to add subtask");
    }
  };

  const handleCompleteSubtask = async (subtaskIndex: number) => {
    if (!task) return;

    try {
      const updatedTask = await taskService.completeSubtask(
        task._id,
        subtaskIndex
      );
      setTask(updatedTask);
      toast.success("Subtask completed successfully");
    } catch (error) {
      console.error("Failed to complete subtask:", error);
      toast.error("Failed to complete subtask");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "testing":
        return "bg-orange-100 text-orange-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view task details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  const canEdit =
    user?.role === "admin" ||
    user?.role === "manager" ||
    task.createdBy._id === user?.id;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600">Task Details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            {canEdit && (
              <Button onClick={() => navigate(`/admin/edit-task/${task._id}`)}>
                Edit Task
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </p>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments ({task.comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!commentInput.trim()}
                  >
                    Add
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {comment.user.firstName[0]}
                          {comment.user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {comment.user.firstName} {comment.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subtasks */}
            <Card>
              <CardHeader>
                <CardTitle>Subtasks ({task.subtasks.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Subtask */}
                <div className="space-y-2">
                  <Input
                    placeholder="Subtask title..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                  />
                  <textarea
                    placeholder="Subtask description (optional)..."
                    value={subtaskDescription}
                    onChange={(e) => setSubtaskDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button
                    onClick={handleAddSubtask}
                    disabled={!subtaskInput.trim()}
                  >
                    Add Subtask
                  </Button>
                </div>

                {/* Subtasks List */}
                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => handleCompleteSubtask(index)}
                        disabled={subtask.completed}
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            subtask.completed
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {subtask.title}
                        </p>
                        {subtask.description && (
                          <p
                            className={`text-sm text-gray-600 ${
                              subtask.completed ? "line-through" : ""
                            }`}
                          >
                            {subtask.description}
                          </p>
                        )}
                        {subtask.completed && subtask.completedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed by {subtask.completedBy.firstName}{" "}
                            {subtask.completedBy.lastName}
                            {subtask.completedAt &&
                              ` on ${formatDate(subtask.completedAt)}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={task.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">{task.type}</Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Assignee:</span>
                    <p className="text-gray-600">
                      {task.assignee.firstName} {task.assignee.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Created by:</span>
                    <p className="text-gray-600">
                      {task.createdBy.firstName} {task.createdBy.lastName}
                    </p>
                  </div>
                  {task.project && (
                    <div>
                      <span className="font-medium">Project:</span>
                      <p className="text-gray-600">{task.project}</p>
                    </div>
                  )}
                  {task.department && (
                    <div>
                      <span className="font-medium">Department:</span>
                      <p className="text-gray-600">{task.department}</p>
                    </div>
                  )}
                  {task.dueDate && (
                    <div>
                      <span className="font-medium">Due Date:</span>
                      <p className="text-gray-600">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  )}
                  {task.estimatedHours && (
                    <div>
                      <span className="font-medium">Estimated Hours:</span>
                      <p className="text-gray-600">{task.estimatedHours}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-gray-600">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <p className="text-gray-600">
                      {formatDate(task.updatedAt)}
                    </p>
                  </div>
                </div>

                {task.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ViewTaskDetails;
