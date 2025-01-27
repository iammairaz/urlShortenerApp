import { Schema, model } from "mongoose";
import { UrlSchema } from "./urlSchema";
import { IRedirect } from "../interfaces/IRedirect";
import { TOPIC } from "../../services/constantService";

const redirectModel = new Schema({
    ip: { type: String, required: true },
    os: { type: String, required: true },
    url: { type: String, required: true },
    device: { type: String, required: true },
    createdAt: { type: Date, required: true },
    topic: {type:String, enum:Object.values(TOPIC)}
}, {
    timeStampp: true, versionKey: false
});

export const redirectSchema = model<IRedirect>("Redirect", redirectModel, "Redirect");

