import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection string
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager";

// Database connection options
const dbOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: "majority" as const,
};

// Connect to MongoDB Atlas
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, dbOptions);

    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("🛑 MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during graceful shutdown:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error);
    process.exit(1);
  }
};

// Export the mongoose connection for use in other parts of the app
export default mongoose.connection;
