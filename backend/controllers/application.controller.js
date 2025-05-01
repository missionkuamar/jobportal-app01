import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply to a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: 'Valid job ID is required.',
                success: false,
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId,
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false,
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Get all jobs a user has applied to
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                }
            });

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No applications found.",
                success: false,
            });
        }

        return res.status(200).json({
            applications,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Get applicants for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false,
            });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            }
        });

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
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Update the application status (e.g., accept/reject)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status || !['pending', 'accepted', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({
                message: 'A valid status is required.',
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                message: "Invalid application ID.",
                success: false,
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: 'Application not found.',
                success: false,
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};
