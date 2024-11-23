import express from "express";
import {
  signupadmin,
  loginadmin,
  addUser,
  getallusers,
  deleteUser,
  getUserById,
  updateUser,
  countUsers,
  countUsersToday,
  countUsersByStatus
} from "../controller/admincontroller.js"; 
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Authentication
router.post("/signup", signupadmin);
router.post("/login", loginadmin);

// User Management
router.post("/add-user", isAdmin, addUser);
router.get("/users", isAdmin, getallusers);
router.delete("/users/:id", isAdmin, deleteUser);
router.get("/users/:id", isAdmin, getUserById);
router.put("/users/:id", isAdmin, updateUser);

// The following routes should not expect an ID in the URL.
router.get("/users/count/total", isAdmin, countUsers); // Total number of users
router.get("/users/count/today", isAdmin, countUsersToday); // Users registered today
router.get("/users/count/status", isAdmin, countUsersByStatus); // Active & Inactive users



export default router;
