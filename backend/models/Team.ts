import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: Types.ObjectId[]; // References to User
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<ITeam>("Team", TeamSchema);
