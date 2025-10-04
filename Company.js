// models/Company.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  defaultCurrency: { type: String, required: true, uppercase: true }
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;