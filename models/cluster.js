const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClusterSchema = Schema({
    id: {
      type: String
    },
    name: {
      type: String
    }
})

const Cluster = mongoose.model(
  'Cluster',
  ClusterSchema
)

module.exports = Cluster
