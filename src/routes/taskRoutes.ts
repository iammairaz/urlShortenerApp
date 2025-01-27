import express from "express";
import taskController from "../controllers/taskController";
import analyticsController from "../controllers/analyticsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import taskMiddleware from "../middlewares/taskMiddleware";

const router = express.Router();

router.post("/shorten", authMiddleware, taskMiddleware.shortUrl,taskController.shortUrl);
router.get("/redirect/:alias",taskController.redirecTo);
router.get("/analytics/alias/:alias", authMiddleware, analyticsController.analysisByAlias);
router.get("/analytics/topic/:topic", authMiddleware, analyticsController.analysisByTopic);
router.get("/analytics/overall", authMiddleware, analyticsController.analysisByUser);

export = router;