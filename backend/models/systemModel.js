import mongoose from 'mongoose';

const systemSchema = new mongoose.Schema({
  machineId: { 
    type: String, 
    required: true,
    index: true 
  },
  timestamp: { type: Date, default: Date.now },
  diskEncryption: {
    encryption: String,
    platform: String
  },
  osUpdate: {
    updateStatus: String,
    lastChecked: String,
    platform: String
  },
  antivirus: {
    antivirus: String,
    platform: String
  },
  sleepSettings: {
    sleepTimeoutMinutes: String,
    platform: String
  }
}, { timestamps: true });

const SystemReport = mongoose.model('SystemReport', systemSchema);
export default SystemReport;
