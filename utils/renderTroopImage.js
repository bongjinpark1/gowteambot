module.exports = async (troop, y = 100) => {
  const Jimp = require('jimp')
  const path = require('path')
  const parseColors = require('./parseColors')
  const url = path.resolve(__dirname, '../img/' + troop._id + '.jpg')

  let crop = true
  const background = await Jimp.read(url)
    .catch(() => {
      console.log('catch1')
      return Jimp.read(troop.imageUrl)
        .then(img => img.writeAsync(url))
    })
    .catch(() => {
      console.log('catch2')
      const baseUrl = 'https://www.taransworld.com/GoW_graphics/Game/'
      const match = troop.imageUrl.match(/http:\/\/gowdb.com\/assets\/(?:cards|spells)\/(.+)\.jpg/)
      if (match) {
        console.log(baseUrl + match[1] + '.png')
        return Jimp.read(baseUrl + match[1] + '.png')
          .then(img => {
            return img.resize(256, Jimp.AUTO, Jimp.RESIZE_BEZIER)
          })
          .then(img => img.writeAsync(url))
          .catch(() => {
            crop = !crop
            return new Jimp(256, 60, 0x00000000)
          })
      } else {
        crop = !crop
        return new Jimp(256, 60, 0x00000000)
      }
    })
  const colors = parseColors(troop.colors)
  const manaSymbol = await Jimp.read(path.resolve(__dirname, '../img/small_' + colors.join('_') + '.png'))
    .catch(() => {
      return null
    })

  const font = await Jimp.loadFont(path.resolve(__dirname, '../font/lato.fnt'))

  const fontX = 5 + 32 + 5
  const fontY = (60 - 18) / 2

  if (crop) background.crop(0, y, 256, 60)

  background
    .print(font, fontX, fontY, troop.name)

  if (manaSymbol) background.composite(manaSymbol, 5, (60 - 32) / 2)

  if (crop) return background.writeAsync(path.resolve(__dirname, '../img/' + troop._id + '.ws.jpg'))
  return background
}
