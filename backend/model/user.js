import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], 
      default: "Active",
    },
    role: {
      type: String, 
      required: [true, "Role is required"],
    },
    permissions: {
      type: [String], 
      validate: {
        validator: (permissions) => permissions.length <= 10,
      },
      default: [],
    },
  },
  { timestamps: true } 
);

const User = mongoose.model("User", userSchema);

export default User;
