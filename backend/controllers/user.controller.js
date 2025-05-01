import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account registered successfully.",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required.",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        message: "Invalid credentials.",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: "Role mismatch.",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // ✅ secure in production
      })
      .json({
        message: "Login successful.",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
        success: true,
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    }).json({
      message: "Logout successful.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Logout failed.", success: false });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file; // For uploaded resume
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email.toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map(s => s.trim());
    }

    if (file) {
      user.profile.resume = file.path;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};
