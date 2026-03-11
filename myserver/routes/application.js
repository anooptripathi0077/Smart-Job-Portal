import express from 'express';
import multer from 'multer';
import * as appCtrl from '../controllers/applicationController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });



// Student applies for a job
router.post('/:jobId', authenticateJWT,upload.single('resume'), appCtrl.applyForJob);

// Recruiter updates application status
router.patch('/:appId/status', authenticateJWT, appCtrl.updateStatus);

// Student sees their own applications
router.get('/my', authenticateJWT, appCtrl.getUserApplications);

export default router;
