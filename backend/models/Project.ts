import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  tasks: Types.ObjectId[]; // References to Task
  team?: Types.ObjectId; // Reference to Team
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  team: { type: Schema.Types.ObjectId, ref: "Team" },
});

export default mongoose.model<IProject>("Project", ProjectSchema);
