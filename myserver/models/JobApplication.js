import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: mongoose.Schema.Types.Mixed,
  resumeUrl: {type:String,required:false},
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Applied',
  },
  appliedAt: { type: Date, default: Date.now }
});

const JobApplication=mongoose.model('JobApplication',jobApplicationSchema);
export default JobApplication;