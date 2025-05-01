import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // auto-lowercase for consistency
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true,
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String }, // path or URL
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    avatar: {
      type: String,
      default: "", // image URL or path
    }
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
