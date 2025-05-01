import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  website: {
    type: String,
    required: true,
  },
  location: String,
  logo: String, // Store path or filename
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Company = mongoose.model("Company", CompanySchema);
export default Company;
