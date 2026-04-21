/**
 * Seed Script: Creates the SuperAdmin account if it doesn't exist.
 * Run with: node scripts/seedSuperAdmin.js
 *
 * Default credentials:
 *   Email:    superadmin@portal.edu
 *   Password: SuperAdmin@123
 *
 * ⚠ CHANGE THESE CREDENTIALS in production!
 */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

import Student from "../models/Student.js";

const SUPERADMIN = {
  name:       "Super Admin",
  email:      "superadmin@portal.edu",
  password:   "SuperAdmin@123",
  department: "Administration",
  role:       "superadmin",
  status:     "active",
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const existing = await Student.findOne({ email: SUPERADMIN.email });
    if (existing) {
      console.log(`ℹ️  SuperAdmin already exists: ${SUPERADMIN.email}`);
    } else {
      const hashed = await bcrypt.hash(SUPERADMIN.password, 10);
      await Student.create({ ...SUPERADMIN, password: hashed });
      console.log("✅ SuperAdmin created successfully!");
      console.log(`   Email   : ${SUPERADMIN.email}`);
      console.log(`   Password: ${SUPERADMIN.password}`);
    }
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();
