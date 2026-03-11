// server/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Common fields for both students and recruiters
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // Store hashed
  },
  role: {
    type: String,
    enum: ['student', 'recruiter', 'admin'],
    required: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],


  // Student-specific fields
  college: String,
  branch: String,
  currentYear: Number,
  skills: [String],
  resumeUrl: String,
  projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      link: String,
    },
  ],

  // Recruiter-specific fields
  company: String,
  companyProfile: String,
  position: String,
  contact: String,

  // Common fields
  profilePicUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,

  // Relations (job applications, jobs posted)
  appliedJobs: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      status: {
        type: String,
        enum: ['applied', 'in_process', 'rejected', 'accepted', 'interview_scheduled'],
        default: 'applied',
      },
      appliedAt: Date,
      interviewDate: Date,
    }
  ],
  jobsPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    }
  ],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
