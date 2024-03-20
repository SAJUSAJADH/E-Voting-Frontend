const mongoose = require('mongoose')

const electionLogSchema = new mongoose.Schema(
  {
    electionname: {
      type: String,
      required: true,
    },
    electiondescription: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contract: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    voters: {
      type: [
        {
          voterid: {
            type: String,
            required: true,
          },
          voted: {
            type: Boolean,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

const ElectionLog =
  mongoose.models.electionlog ||
  mongoose.model('electionlog', electionLogSchema)

module.exports = ElectionLog
