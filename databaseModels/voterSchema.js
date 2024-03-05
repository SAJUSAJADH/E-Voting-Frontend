const mongoose = require('mongoose')

const voterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  voterId: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  faceAuthenticated: {
    type: Boolean,
    required: true,
    default: 'false',
  },
  digitalWallet: {
    type: String,
    required: true,
    unique: true,
  },
  elections: {
    type: String,
  },
})

const Voter = mongoose.models.voter || mongoose.model('voter', voterSchema)

module.exports = Voter
