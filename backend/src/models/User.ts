import mongoose from "mongoose";

export type UserRole = "farmer" | "owner" | "admin";

interface IUser extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["farmer", "owner", "admin"],
      default: "farmer"
    },
    location: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;