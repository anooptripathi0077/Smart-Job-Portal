import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';

// Create job (recruiter only)
export const createJob = async (req, res) => {
  try {
    const { title, description, dynamicFields } = req.body;
    const recruiter = req.user.userId;

    const job = new Job({ title, description, recruiter, dynamicFields });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get job details
export const getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get all applications for a job (recruiter only)
export const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only recruiter can view applications' });
    }

    const applications = await JobApplication.find({ job: req.params.id })
      .populate('applicant', 'name email college branch');

    res.json(applications);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
