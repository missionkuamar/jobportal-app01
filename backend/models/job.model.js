import mongoose from "mongoose";

// Define the Job Schema
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
    }
  ],
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  experienceLevel: {  // ✅ fixed typo: was "expercienceLevel"
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [  // ✅ renamed from "application" to "applications" for consistency
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    }
  ]
}, { timestamps: true });

// Export the model correctly
export const Job = mongoose.model("Job", JobSchema);
