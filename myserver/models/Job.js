import mongoose from 'mongoose';

// Each job field with type/label/required/options
const dynamicFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  fieldType: { type: String, enum: ['text', 'number', 'email', 'select', 'textarea'], required: true },
  required: { type: Boolean, default: false },
  options: [String], // for 'select'
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dynamicFields: [dynamicFieldSchema],
  createdAt: { type: Date, default: Date.now },
});

const Job=mongoose.model('Job',jobSchema);
export default Job;