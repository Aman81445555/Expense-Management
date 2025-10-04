// models/Expense.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, uppercase: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  // This array will hold the approval workflow steps
  approvers: [{
    approverId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    comment: String,
  }],
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;