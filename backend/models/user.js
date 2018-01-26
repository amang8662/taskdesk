import mongoose, { Schema } from 'mongoose';
var uniqueValidator = require('mongoose-unique-validator');

// Define user schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('user', userSchema);