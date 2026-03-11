import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";     // ✅ ../ (go up one level)
import { enhanceResume } from "../controllers/resumeController.js";  // ✅ ../ (go up one level)

const router = express.Router();

router.post("/enhance", upload.single("resume"), enhanceResume);

export default router;
