const mongoose = require('mongoose')

const electionLogSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

const ElectionLog =
  mongoose.models.electionlog ||
  mongoose.model('electionlog', electionLogSchema)

module.exports = ElectionLog
