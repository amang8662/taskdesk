import mongoose, { Schema } from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator');

// Define proposal schema
var proposalSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
});
proposalSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('Proposal', proposalSchema);