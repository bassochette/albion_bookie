const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GvgSchema = Schema({
  matchId: {
    type: String
  },
  matchType: {
    type: String
  },
  startTime: {
    type: Date
  },
  attacker: {
    type: Schema.Types.ObjectId,
    ref: 'Guild'
  },
  defender: {
    type: Schema.Types.ObjectId,
    ref: 'Guild'
  },
  cluster: {
    type: Schema.Types.ObjectId,
    ref: 'Cluster'
  },
  attackerScore: {
    type: Number,
    default: 150
  },
  defenderScore: {
    type: Number,
    default: 150
  },
  over: {
    type: Boolean,
    default: false
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'Guild'
  },
  contract: {
    type: String
  }
})

const Gvg = mongoose.model(
  'Gvg',
  GvgSchema
)

module.exports = Gvg
