import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserModel = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: {type: String, required:true},
    googleId: {type:String,required:true}
}, {
    timestamps: true, versionKey: false
});

export const UserSchema = mongoose.model<IUser>("User", UserModel, "User");

