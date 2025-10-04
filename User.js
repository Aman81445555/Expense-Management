// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Manager', 'Employee'] // Only these values are allowed
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  manager: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;