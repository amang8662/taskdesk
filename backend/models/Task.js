import mongoose, { Schema } from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator');

// Define proposal schema
var proposalSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});

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
  payment: {
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
  proposals: [proposalSchema],
}, {timestamps: true});
taskSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('Task', taskSchema);