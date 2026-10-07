import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@comradehub.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    const admin = await User.create({
      firstName: "ComradeHub",
      lastName: "Admin",
      email: "admin@comradehub.com",
      phone: "0700000000",
      password: hashedPassword,
      accountType: "Admin",
      agree: true,
      isActive: true,
    });

    console.log("Admin created successfully:");
    console.log(admin.email);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();