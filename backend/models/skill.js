import mongoose, { Schema } from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator');

// Define skill schema
var skillSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
skillSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('skill', skillSchema);