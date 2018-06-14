import mongoose, { Schema } from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator');

// Define task schema
var taskSchema = new Schema({
  task_creater: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  task_taker: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rewardscore: {
    type: Number,
  },
  status: {
    type: Number,
    default: 0,
  },
  skills: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ],
}, {timestamps: true});
taskSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('Task', taskSchema);