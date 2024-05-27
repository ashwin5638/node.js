const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// AP1 1

const convertDbObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `

   select * from cricket_team;
     `
  const playerList = await db.all(getPlayerQuery)

  response.send(playerList.map(eachPlayer => convertDbObject(eachPlayer)))
})

// add 2

app.post('/players/', async (request, response) => {
  const getDetails = request.body
  const {player_name, jersey_number, role} = getDetails

  const addPlayerQuery = `
    Insert into 
    cricket_team(playerName, jerseyNumber, role)
    values(
     ${player_name},
     ${jersey_number},
     ${role}
    );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

// api3

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  select 
    *
  from
      cricket_team
  where
   player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  const {player_id, player_name, jersey_number, role} = player
  const dbResponse = {
    playerId: player_id,
    playerName: player_name,
    jerseyNumber: jersey_number,
    role: role,
  }
  response.send(dbResponse)
})

// API 4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getBody = request.body
  const {player_name, jersey_number, role} = getBody
  const updatePlayerQuery = `
  update
    cricket_team
  set 
    player_name:${player_name},
    jersey_number: ${jersey_number},
    role: ${role} 
  where
    player_id = ${playerId} ;`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

// API 5
app.delete('/players/:playerId/', async (request, response) => {
  const {playersId} = request.params
  const deleteQuery = `
  delete from 
      cricket_team
    where 
     playerId = ${playersId};`
  await db.run(deleteQuery)
  response.send('player Removed')
})

module.exports = app
