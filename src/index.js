require('dotenv').config()
const Database = require('simple-json-db')
const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const ejs = require('ejs')
// disable express
app.disable('x-powered-by')
const db = new Database(path.join(__dirname, 'db', 'db.json'))
const includeFile = (filePath, ops = { include: includeFile}) => {
  return ejs.render(fs.readFileSync(path.join(__dirname, 'views', filePath)).toString(), ops)
}
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', (filePath, options, callback) => { // define the template engine
  options = { ...options, include: includeFile }
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err)
      // this is an extremely simple template engine
    const rendered = ejs.render(require('fs').readFileSync(path.join(__dirname, 'views', 'layout.ejs')).toString(), { content: ejs.render(content.toString(), options), ...options })
    return callback(null, rendered)
  })
})
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/upload', (req, res) => {
  res.render('upload')
})
app.get('/video/:id', (req, res) => {
  // const db = new Database(path.join(__dirname, 'db', 'db.json'))
  // const video = db.get(req.params.id)
  // if (video) {
  res.render('video')
  // } else {
  //   res.status(404).send('Video not found')
  // }
})
app.post('/video/create', (req, res) => {
  const {
    name,
    description,
    video
  } = req.body
  const id = crypto.randomBytes(16).toString('hex').slice(0, 6)
  db.set(id, {
    id,
    name,
    description,
    video,
    likes: 0,
    dislikes: 0,
    views: 0,
    comments: []
  })
  res.status(201).json({ id })
})
app.post('/video/:id/like', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    video.likes++
    db.set(req.params.id, video)
    res.status(200).json({ likes: video.likes })
  } else {
    res.status(404).send('Video not found')
  }
})
app.post('/video/:id/dislike', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    video.dislikes++
    db.set(req.params.id, video)
    res.status(200).json({ dislikes: video.dislikes })
  } else {
    res.status(404).send('Video not found')
  }
})
app.post('/video/:id/view', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    video.views++
    db.set(req.params.id, video)
    res.status(200).json({ views: video.views })
  } else {
    res.status(404).send('Video not found')
  }
})
app.post('/video/:id/comment', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    const { comment } = req.body
    video.comments.push(comment)
    db.set(req.params.id, video)
    res.status(200).json({ comments: video.comments })
  } else {
    res.status(404).send('Video not found')
  }
})
app.get('/video/:id/comments', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    res.status(200).json({ comments: video.comments })
  } else {
    res.status(404).send('Video not found')
  }
})
app.get('/video/:id/likes', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    res.status(200).json({ likes: video.likes })
  } else {
    res.status(404).send('Video not found')
  }
})
app.get('/video/:id/dislikes', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    res.status(200).json({ dislikes: video.dislikes })
  } else {
    res.status(404).send('Video not found')
  }
})
app.get('/video/:id/views', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    res.status(200).json({ views: video.views })
  } else {
    res.status(404).send('Video not found')
  }
}
)
app.get('/video/:id/data', (req, res) => {
  const video = db.get(req.params.id)
  if (video) {
    res.status(200).json({ video })
  } else {
    res.status(404).send('Video not found')
  }
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
 // Automatic 30 second git pull.
setInterval(() => {
  exec(`git pull`, (error, stdout) => {
    let response = error || stdout
    if (!error) {
      if (!response.includes('Already up to date.')) {
        console.log(response)
        setTimeout(() => {
          process.exit()
        }, 1000)
      }
    }
  })
}, 30000)
