import bodyparser from 'body-parser'
// import dotenv from 'dotenv'
import db from 'mysql'
import express from 'express'

// Configuration

const app = express()

app.use(bodyparser.json())

// Process

app.post('/api', (req, res) => {
  const category = req.body.req
  let data = []

  let connection = db.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  connection.connect((err) => {
    if (err)
      console.log(err)
  })

  connection.query('SELECT `name_en`, `name_jp`, `artist_en`, `artist_jp`, `image_url`, `version`, `bpm`, `level_easy`, `level_basic`, `level_advanced`, `level_expert`, `level_master`, `level_remaster`, `listen_youtube`, `listen_niconico`, `regionlocked` FROM `' + category + '` WHERE 1 ORDER BY RAND() LIMIT 5', (err, rows, fields) => {
    if (err) {
      data.push({
        "reponse": "error",
        "remark": err
      })
    }
    else {
      rows = JSON.parse(JSON.stringify(rows))
      rows.forEach(row => {
        console.log(row.name_en)
        data.push(
          {
            "name": {
              "en": row.name_en,
              "jp": row.name_jp
            },
            "artist": {
              "en": row.artist_en,
              "jp": row.artist_jp
            },
            "image_url": row.image_url,
            "version": row.version,
            "bpm": row.bpm,
            "level": {
              "easy": row.level_easy,
              "basic": row.level_basic,
              "advanced": row.level_advanced,
              "expert": row.level_expert,
              "master": row.level_master,
              "remaster": row.level_remaster
            },
            "listen": {
              "youtube": row.listen_youtube,
              "niconico": row.listen_niconico
            },
            "regionlocked": row.regionlocked
          }
        )
      })
    }

    connection.end()

    res.send(data);
  })
})

app.listen(process.env.PORT);
