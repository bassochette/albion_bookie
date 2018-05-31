const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ToonSchema = Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  guild: {
    type: Schema.Types.ObjectId,
    ref: 'Guild'
  }
})

const Toon = mongoose.model(
  'Toon',
  ToonSchema
)

module.exports = Toon
