// server/models/Certificate.js
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  org: { type: String, required: true },
  badge: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
  verify: { type: String },
  download: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', CertificateSchema);