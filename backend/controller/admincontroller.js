import { Admin } from "../model/admin.js";
import User from "../model/user.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupadmin = async (req, res) => {
  try {
    const { name, email, password, role = "Admin" } = req.body; // Default role to "Admin"
    const existadmin = await Admin.findOne({ email });
    if (existadmin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const newAdmin = new Admin({ name, email, password, role });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "10h" });
    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, phone, role, permissions, status = "Active" } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create the new user
    const newUser = new User({
      name,
      email,
      phone,
      role,
      permissions,
      status,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ message: "User details retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, role, permissions } = req.body; // Add permissions to the request body

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.status = status || user.status;
    user.role = role || user.role;

    // Update permissions if provided
    if (permissions && Array.isArray(permissions)) {
      user.permissions = permissions;
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// In the controller for counting users
export const countUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.status(200).json({ message: "Users count retrieved successfully", totalUsers: users.length })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


export const countUsersToday = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day (midnight)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day

    const usersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({ message: "Number of users registered today", usersToday });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const countUsersByStatus = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ status: "Active" });
    const inactiveUsers = await User.countDocuments({ status: "Inactive" });

    res.status(200).json({
      message: "User status counts",
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
