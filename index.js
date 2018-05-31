if(process.env.NODE_PATH === undefined) {
  throw new Error('NODE_PATH env variable is not set')
}

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/albion_bookie')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  require('web/server')
  require('worker')
});
