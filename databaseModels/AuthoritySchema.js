const mongoose = require('mongoose')

const authoritySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Authority =
  mongoose.models.authority || mongoose.model('authority', authoritySchema)

module.exports = Authority
