const fs = require('fs')

const files = fs.readdirSync(
  `${process.env.NODE_PATH}/models`,
)

const models = files
  .reduce(
    (carry, file) => {
      if (file === "index.js") return carry
      carry[file.split('.js')[0]] = require(`${process.env.NODE_PATH}/models/${file.split('.js')[0]}`)
      return carry
    },
    {}
  )

module.exports = models;
