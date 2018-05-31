const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
  discordId: {
    type: String
  },
  displayName: {
    type: String
  },
  wallet: {
    type: String
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
