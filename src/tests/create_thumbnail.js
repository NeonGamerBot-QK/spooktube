var thumbler = require('video-thumb')
// __
const path = require('path')
const publicPath = path.join(__dirname, '..', 'public')
thumbler.extract(
    publicPath + '/example.webm',
    publicPath + '/example-cover2.png',
    // do 1st second frame
    '00:00:01',
    // 210 because its 420/2 (420 is the original size) & +35 to make them fit
    '245x245', function (...arts) {
      console.log(arts)

      console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:01')
    })
