require('dotenv').config()
const Database = require("simple-json-db");
const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process');
const ejs = require('ejs')
//disable express
app.disable('x-powered-by')

app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', (filePath, options, callback) => { // define the template engine
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
 //Automatic 30second git pull.
 setInterval(() => {
    exec (`git pull`, (error, stdout) => {
        let response = error || stdout;
        if (!error) {
            if (!response.includes("Already up to date.")) {
              console.log(response)
                setTimeout(() => {
                    process.exit();
                }, 1000);
            }
        }
    });
}, 30000);