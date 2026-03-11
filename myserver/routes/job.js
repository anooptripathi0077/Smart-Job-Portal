import express from 'express';
import * as jobCtrl from '../controllers/jobController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Recruiter creates a job
router.post('/', authenticateJWT, jobCtrl.createJob);

// Get all jobs (all users)
router.get('/', jobCtrl.getJobs);

// Get job details by ID (all users)
router.get('/:id', jobCtrl.getJobDetails);

// Get applications for a job (recruiter only)
router.get('/:id/applications', authenticateJWT, jobCtrl.getApplicationsForJob);

export default router;
