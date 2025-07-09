const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Define User schema and model inline since we can't import TypeScript directly
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    avatar: String,
    phone: String,
    department: String,
    position: String,
    dateOfBirth: Date,
    hireDate: Date,
    lastLogin: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Create admin user function
const createAdminUser = async (adminData) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists with this email");
      return;
    }

    // Create admin user (password will be hashed automatically by the schema)
    const adminUser = new User({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      password: adminData.password,
      role: "admin",
      status: "active",
      isEmailVerified: true,
      department: adminData.department || "Administration",
      position: adminData.position || "System Administrator",
      hireDate: new Date(),
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminUser.email);
    console.log("👤 Name:", `${adminUser.firstName} ${adminUser.lastName}`);
    console.log("🔑 Role:", adminUser.role);
    console.log("📅 Created:", adminUser.createdAt);

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
};

// Main execution
const main = async () => {
  // Default admin data (you can modify these values)
  const adminData = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@taskmanager.com",
    password: "Admin123!",
    department: "Administration",
    position: "System Administrator",
  };

  console.log("🚀 Creating admin user...");
  console.log("📧 Email:", adminData.email);
  console.log("🔑 Password:", adminData.password);
  console.log("");

  await connectDB();
  await createAdminUser(adminData);

  console.log("");
  console.log(
    "🎉 Setup complete! You can now login with the admin credentials."
  );
  console.log("💡 Remember to change the default password after first login.");

  mongoose.connection.close();
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createAdminUser };
