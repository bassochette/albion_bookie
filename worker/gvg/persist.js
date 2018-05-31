const moment = require("moment")
const { gvg, guild, cluster } = require('models')

const persistGvg = async data => {
  // console.log("===> ", data)
  // check if match exist
  let gvgTease = await gvg.findOne({
    matchId: data.MatchId
  }).exec()

  if (!gvgTease) {
    console.log("beginning", data.StartTime)
    let startTime = moment(data.StartTime)
    gvgTease = new gvg({
      matchId: data.MatchId,
      matchType: data.MatchType,
      startTime,
      attackerScore: data.AttackerTickets,
      defenderScore: data.DefenderTickets
    })
  } else {
    if (gvgTease.over) return
    gvgTease.attackerScore = data.AttackerTickets
    gvgTease.defenderScore = data.DefenderTickets
  }

  // check guilds
  let attacker = await guild.findOne({
    id: data.Attacker.Id
  }).exec()
  if (!attacker) {
    console.log("saving attacker")
    attacker = new guild({
      id: data.Attacker.Id,
      name: data.Attacker.Name
    })
    await attacker.save()
  }
  gvgTease.attacker = attacker

  let defender = await guild.findOne({
    id: data.Defender.Id
  }).exec()
  if (!defender) {
    console.log("saving defender")
    defender = new guild({
      id: data.Defender.Id,
      name: data.Defender.Name
    })
    await defender.save()
  }
  gvgTease.defender = defender

  // check Cluster

  if (data.DefenderTerritory) {
    let defenderCluster = await cluster.findOne({
      id: data.DefenderTerritory.ClusterId
    }).exec()
    if (!defenderCluster) {
      defenderCluster = new cluster({
        id: data.DefenderTerritory.ClusterId,
        name: data.DefenderTerritory.ClusterName
      })
      await defenderCluster.save()
    }
    gvgTease.cluster = defenderCluster
  } else if (data.AttackerTerritory) {
    let attackerCluster = await cluster.findOne({
      id: data.AttackerTerritory.ClusterId
    }).exec()
    if (!attackerCluster) {
      attackerCluster = new cluster({
        id: data.AttackerTerritory.ClusterId,
        name: data.AttackerTerritory.ClusterName
      })
      await attackerCluster.save()
    }
    await attackerCluster.save()
    gvgTease.cluster = attackerCluster
  }

  if (data.Winner) {
    gvgTease.over = true
    if (data.Winner == 2 ) {
      gvgTease.winner = attacker
    } else {
      gvgTease.winner = defender
    }
  }

  await gvgTease.save()
}

module.exports = async (data) => {
  const {next, past} = data
  while (next.length > 0) {
    await persistGvg(next.pop())
  }
  while (past.length > 0) {
    await persistGvg(past.pop())
  }
}
