import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors"
import { httpLogger } from "./utils";
import { MAX_UPLOAD_LIMIT } from "./config/config";
import {setupGoogleAuth} from "./config/passportConfig";
import errorMiddleware from "./middlewares/errorMiddleWare";
import mainRouter from "./routes/mainRouter";

const app = express();
app.use(express.json({ limit: MAX_UPLOAD_LIMIT }));
app.use(express.urlencoded({ limit: MAX_UPLOAD_LIMIT, extended: true }));
app.use(cors());
app.use(httpLogger);
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

setupGoogleAuth();
app.use("/api",mainRouter);
app.use((req,res,next) => {
    res.status(400).json({
        message: "Not Found"
    })
})
app.use(errorMiddleware);

export default app;