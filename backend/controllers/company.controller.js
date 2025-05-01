import mongoose from "mongoose";
import Company from "../models/company.model.js";

// ✅ Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { name, website } = req.body;

    if (!name || !website) {
      return res.status(400).json({
        message: "Company name and website are required.",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }

    const company = await Company.create({
      name,
      website,
      userId: req.id, // Auth middleware should set req.id
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Get company of current user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID.",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Update company by ID
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID.",
        success: false,
      });
    }

    const updateData = {};

    const fields = ['name', 'description', 'website', 'location'];
    fields.forEach(field => {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    });

    if (req.file) {
      updateData.logo = req.file.path; // Adjust depending on storage strategy
    }

    const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully.",
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
