const crawler = require('worker/gvg/crawler')
const persist = require('worker/gvg/persist')

const main = async () => {
    console.log("crawling albion API")
    const data = await crawler()
    await persist(data)
    console.log("Crawl Over")
}

main()
setInterval(
  main,
  1000*60*60
)
