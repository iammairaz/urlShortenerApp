import express from "express";
import authRoutes from "./authRoutes";
import taskRoutes from "./taskRoutes";

const router = express.Router();

router.use("/auth",authRoutes);
router.use("/task",taskRoutes);

export = router;