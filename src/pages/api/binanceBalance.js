// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Binance = require("node-binance-api")
const API_KEY = process.env.API_KEY
const binance = new Binance().options({
  APIKEY: API_KEY,
  APISECRET: process.env.API_SECRET,
  family: 4,
})

export default async function handler(req, res) {
  if (req.query.key !== API_KEY) {
    res.send("[]")
    return
  }

  let result = req.query.type === "lending" ? await lending() : await spot()

  res.status(200).json(result)
}

const spot = async () => {
  let balances = await binance.balance()
  let result = []
  console.log(balances)
  for (let b of Object.keys(balances)) {
    result.push({
      ticker: b,
      value: Number(balances[b].available),
    })
  }
  result = result.filter((b) => b.value > 0.0)
  console.log(result)
  return result
}

const lending = async () => {
  let lendingData = await binance.lending()
  result = lendingData.positionAmountVos.map((item) => {
    return { ticker: item.asset, value: Number(item.amount) }
  })
  return result
}
