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
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  profilepic: {
    type: String,
    default: "default/user.png",
  },
  level: {
    type: Number,
    default: 1,
  },
  user_type: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  skills: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ],
});
userSchema.plugin(uniqueValidator);

// Export Mongoose model
export default mongoose.model('User', userSchema);