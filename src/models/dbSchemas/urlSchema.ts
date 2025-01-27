import mongoose from "mongoose";
import { TOPIC } from "../../services/constantService";
import { IUrl } from "../interfaces/IUrl";

const urlModel = new mongoose.Schema({
    urlId: { type: String, required: true, unique: true },
    origUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    alias: { type: String, required: true },
    topic: { type: String, enum: Object.values(TOPIC) },
    clicks: { type: Number, default: 0 },
    createdBy: { type: String, required: true }
}, {
    timestamps: true, versionKey: false
});

export const UrlSchema = mongoose.model<IUrl>("Url", urlModel, "Url");