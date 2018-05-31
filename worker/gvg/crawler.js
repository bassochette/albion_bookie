const upcomingGvgs = require('client/upcomingGvgs')
const pastGvgs = require('client/pastGvgs')


module.exports = async () => {
  const data = {
    next: await upcomingGvgs(),
    past: await pastGvgs()
  }

  return data
}
