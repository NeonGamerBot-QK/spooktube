process.env.DEBUG = '*'
process.env.DEBUG_COLORS = true
var getDimensions = require('get-video-dimensions')
const path = require('path')
const publicPath = path.join(__dirname, '..', 'public')
getDimensions(publicPath + '/example.webm').then(function (dimensions) {
  console.log(dimensions.width)
  console.log(dimensions.height)
  console.log(dimensions)
})
