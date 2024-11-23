import jwt from "jsonwebtoken";
import { Admin } from "../model/admin.js";

export const isAdmin = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; 
  
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      req.admin = decoded; 
  
      const admin = await Admin.findById(req.admin.id);
      if (!admin || admin.role !== 'Admin') {
        return res.status(403).json({ message: "Only admins can perform this action" });
      }
  
      next(); 
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  