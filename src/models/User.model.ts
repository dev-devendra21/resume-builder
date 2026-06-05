import mongoose, { Document } from "mongoose";
import { IUser } from "@/types/user.type";
import bcrypt from "bcrypt";

interface UserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidatePassword: string): boolean;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, "Mobile is required"],
      minlength: [10, "Mobile must be at least 10 characters"],
      maxlength: [10, "Mobile must be at most 10 characters"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
