const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: Number, required: true }, // 1: Male, 0: Female
  ethnicity: { type: Number },
  country: { type: Number },
  jaundice: { type: Number }, // 1: Yes, 0: No
  familyASD: { type: Number }, // 1: Yes, 0: No
  speechDelay: { type: Number },
  learningDisorder: { type: Number },
  geneticDisorders: { type: Number },
  depression: { type: Number },
  iddd: { type: Number },
  socialBehavioralIssues: { type: Number },
  anxiety: { type: Number },

  results: [{
    prediction: String, // "Positive" or "Negative"
    probability: Number,
    features: Object, // Summary of inputs
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Child', ChildSchema);
