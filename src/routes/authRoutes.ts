import express from "express";
import passport from "passport";
import authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    authController.googleAuthRedirect
);

router.get(
    "/profile",
    authMiddleware,
    authController.getUserProfile
);

export = router;
