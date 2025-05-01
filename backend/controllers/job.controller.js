import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import Company from "../models/company.model.js";

// ✅ POST Job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      requirements,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    // Validate all fields
    if (
      !title || !description || !salary || !requirements ||
      !location || !jobType || !experience || !position || !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID.",
        success: false,
      });
    }

    const formattedRequirements = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map(req => req.trim());

    const job = await Job.create({
      title,
      description,
      salary: Number(salary),
      requirements: formattedRequirements,
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "Job created successfully.",
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ GET All Jobs (with optional keyword search)
export const getAllJobs = async (req, res) => {
  try {
    const keyWord = req.query.keyWord || "";

    const query = {
      $or: [
        { title: { $regex: keyWord, $options: "i" } },
        { description: { $regex: keyWord, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query).populate("company");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ GET Job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ GET Admin's Jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId }).populate("company");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found for this admin.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
