import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import User from "./models/User.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Analytics from "./models/Analytics.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const sampleProjects = [
  {
    title: "SAP S/4HANA CDS & OData Services Integration",
    description: "Designed and implemented Core Data Services (CDS) views with analytical annotations and exposed OData services for consumption by SAP Fiori enterprise frontends.",
    technologies: ["SAP ABAP", "CDS Views", "OData", "S/4HANA", "Fiori"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "https://dilakesh-portfolio.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    featured: true,
    order: 1,
  },
  {
    title: "Interactive ALV Grid & Performance Optimization Engine",
    description: "Built modular ALV grid reports with custom user commands, event handling, and SQL performance enhancements reducing execution time by 40%.",
    technologies: ["OOPS ABAP", "ALV Grid", "Data Dictionary", "Performance Tuning"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    featured: true,
    order: 2,
  },
  {
    title: "Batch Data Communication (BDC) Automation Tool",
    description: "Automated legacy master data migration using Call Transaction and Session methods with error trapping and reconciliation logs.",
    technologies: ["BDC", "SAP Scripts", "User Exits", "BADIs"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
    featured: false,
    order: 3,
  },
];

const sampleSkills = [
  { name: "SAP ABAP", category: "technical", proficiency: "Advanced", order: 1 },
  { name: "S/4HANA", category: "technical", proficiency: "Advanced", order: 2 },
  { name: "CDS Views", category: "technical", proficiency: "Proficient", order: 3 },
  { name: "OData", category: "technical", proficiency: "Proficient", order: 4 },
  { name: "ALV Reports", category: "technical", proficiency: "Advanced", order: 5 },
  { name: "Classical Reports", category: "technical", proficiency: "Advanced", order: 6 },
  { name: "Interface Reports", category: "technical", proficiency: "Proficient", order: 7 },
  { name: "OOPS ABAP", category: "technical", proficiency: "Advanced", order: 8 },
  { name: "BDC", category: "technical", proficiency: "Proficient", order: 9 },
  { name: "Smartforms", category: "technical", proficiency: "Proficient", order: 10 },
  { name: "SAP Scripts", category: "technical", proficiency: "Proficient", order: 11 },
  { name: "BADIs & User Exits", category: "technical", proficiency: "Advanced", order: 12 },
  { name: "Data Dictionary", category: "technical", proficiency: "Advanced", order: 13 },
  { name: "Java & REST APIs", category: "technical", proficiency: "Intermediate", order: 14 },
  { name: "SDLC & Agile", category: "competency", proficiency: "Advanced", order: 15 },
  { name: "Requirements Analysis", category: "competency", proficiency: "Advanced", order: 16 },
  { name: "Root Cause Analysis", category: "competency", proficiency: "Advanced", order: 17 },
  { name: "Software Testing & Validation", category: "competency", proficiency: "Advanced", order: 18 },
  { name: "Technical Documentation", category: "competency", proficiency: "Advanced", order: 19 },
  { name: "System Performance Optimization", category: "competency", proficiency: "Advanced", order: 20 },
];

const sampleExperiences = [
  {
    company: "Accenture",
    role: "SAP ABAP Junior Developer",
    startDate: "JAN 2026",
    endDate: "PRESENT",
    description: "Developing, testing, debugging and enhancing mission-critical SAP enterprise programs.",
    bullets: [
      "Designed, developed and maintained classical reports, ALV reports, interfaces and enhancements aligned with business requirements and SDLC standards.",
      "Analyzed and debugged issues using SAP logs, database tables and backend data to support system functionality and quality assurance.",
      "Collaborated with functional consultants and cross-functional teams to capture requirements and deliver technical solutions.",
      "Performed root cause analysis and identified improvements for system performance and availability.",
      "Developed and automated test cases, scenarios and usage cases for software validation in a private cloud environment.",
    ],
    technologies: ["SAP ABAP", "S/4HANA", "ALV", "CDS Views", "OData"],
    location: "Bengaluru, India",
    type: "job",
    order: 1,
  },
  {
    company: "Accenture",
    role: "SAP ABAP Development on S/4HANA Training",
    startDate: "AUG 2025",
    endDate: "DEC 2025",
    description: "Intensive enterprise training program on S/4HANA programming paradigms and best practices.",
    bullets: [
      "Mastered CDS views, OData service generation, and modern ABAP syntax.",
      "Built end-to-end BDC batch programs and ALV reporting solutions.",
    ],
    technologies: ["ALV Reports", "BDC Programs", "CDS Views", "OData Services", "Enhancements"],
    location: "Remote",
    type: "training",
    order: 2,
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // Clean existing data
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Analytics.deleteMany({}),
    ]);

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || "dilakesh756@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`👤 Admin user created: ${adminEmail}`);

    // Seed Projects, Skills, Experiences, Analytics
    await Project.insertMany(sampleProjects);
    console.log(`📁 Seeded ${sampleProjects.length} projects`);

    await Skill.insertMany(sampleSkills);
    console.log(`⚡ Seeded ${sampleSkills.length} skills`);

    await Experience.insertMany(sampleExperiences);
    console.log(`💼 Seeded ${sampleExperiences.length} experiences`);

    await Analytics.create({
      key: "resume_downloads",
      count: 14,
    });
    console.log(`📊 Initialized analytics`);

    console.log("🎉 Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
