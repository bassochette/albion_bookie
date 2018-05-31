const express = require('express')
const server = express()
const {gvg} = require('models')

server.use(express.static('web/public'))
server.set('view engine', 'ejs')
server.get(
  "/",
  async (request, response) => {
    const future = await gvg.find({
      over: false
    })
    .populate('attacker')
    .populate('defender')
    .populate('cluster')
    .sort('startTime')
    .limit(50)
    .exec()

    const past = await gvg.find({
      over: true
    })
    .populate('attacker')
    .populate('defender')
    .populate('cluster')
    .sort('startTime')
    .limit(50)
    .exec()


    response.render(
      'home',
      {
        future,
        past
      }
    )
  }
)

server.listen(3000)
