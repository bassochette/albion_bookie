const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BetSchema = Schema({
  gvg: {
    type: Schema.Types.ObjectId,
    ref: 'Gvg'
  },
  team: String,
  amount: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})
const Bet = mongoose.model(
  'Bet',
  BetSchema
)

module.exports = Bet
