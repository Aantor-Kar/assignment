import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      select: false,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    isAgency: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    phone: this.phone,
    email: this.email,
    companyName: this.companyName,
    isAgency: this.isAgency,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
