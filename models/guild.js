const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GuildSchema = Schema({
  id: {
    type: String
  },
  name: {
    type: String
  }
})

const Guild = mongoose.model(
  'Guild',
  GuildSchema
)

module.exports = Guild
