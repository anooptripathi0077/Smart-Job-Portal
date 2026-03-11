// import Job from '../models/Job.js';
// import JobApplication from '../models/JobApplication.js';

// // Apply for a job
// export const applyForJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const body = req.body || {};

//     let responses = body.responses ?? {};
//     if (typeof responses === 'string') {
//       try { responses = JSON.parse(responses); } catch {}
//     }

//     // ✅ Fix: use req.user.userId instead of req.userId
//     const applicantId = req.user.userId;

//     const alreadyApplied = await JobApplication.findOne({
//       job: jobId,
//       applicant: applicantId,
//     });

//     if (alreadyApplied) {
//       return res.status(400).json({ message: 'Already applied for this job.' });
//     }

//     const resumeUrl = req.body.resumeUrl ? req.body.resumeUrl : null;

//     const application = new JobApplication({
//       job: jobId,
//       applicant: applicantId,
//       responses,
//       ...(resumeUrl && { resumeUrl }),
//     });

//     await application.save();

//     res.status(201).json({
//       success: true,
//       message: 'Application submitted successfully',
//       application,
//     });
//   } catch (err) {
//     console.error('Error in applyForJob:', err);
//     res.status(500).json({ message: err.message });
//   }
// };



// // Update application status (recruiter only)
// export const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const app = await JobApplication.findById(req.params.appId);
//     if (!app) return res.status(404).json({ message: 'Application not found' });

//     const job = await Job.findById(app.job);
//     if (job.recruiter.toString() !== req.user.userId) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     app.status = status;
//     await app.save();
//     res.json(app);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // Get all applications of the logged-in user
// export const getUserApplications = async (req, res) => {
//   try {
//     const apps = await JobApplication.find({ applicant: req.user.userId })
//       .populate('job', 'title description recruiter')
//       .populate({
//         path: 'job',
//         populate: { path: 'recruiter', select: 'name company' }
//       });
//     res.json(apps);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// applicationController.js
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Route to get signed upload signature for raw files (PDF/DOC)
export const getResumeUploadSignature = (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp, resource_type: 'raw', folder: 'resumes' },
      process.env.CLOUD_API_SECRET
    );

    res.json({ signature, timestamp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    let { responses, resumeUrl } = req.body;

    if (typeof responses === 'string') {
      try { responses = JSON.parse(responses); } catch {}
    }

    const applicantId = req.user.userId;

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job.' });
    }

    const application = new JobApplication({
      job: jobId,
      applicant: applicantId,
      responses,
      ...(resumeUrl && { resumeUrl }),
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    console.error('Error in applyForJob:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update application status (recruiter only)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await JobApplication.findById(req.params.appId);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findById(app.job);
    if (job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    app.status = status;
    await app.save();
    res.json(app);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get all applications of the logged-in user
export const getUserApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find({ applicant: req.user.userId })
      .populate('job', 'title description recruiter')
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'name company' }
      });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
