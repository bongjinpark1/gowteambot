module.exports = async (troops, kingdom) => {
  const Jimp = require('jimp')
  const path = require('path')
  const renderTroopImage = require('./renderTroopImage')

  const background = new Jimp(5 + 256 + 5 + 102 + 5, (60 * 4) + (5 * 5), 0x00000000)
  const troopImages = await Promise.all(troops.map(troop => {
    const url = path.resolve(__dirname, '../../../../img/' + troop._id + '.ws.jpg')
    return Jimp.read(url)
      .catch(() => {
        return renderTroopImage(troop)
      })
      .catch(() => {
        return null
      })
  }))
  const bannerUrl = path.resolve(__dirname, '../../../../img/banners/' + kingdom._id + '.png')
  const bannerImage = await Jimp.read(bannerUrl)
    .catch(() => {
      return null
    })

  troopImages.forEach((img, index) => {
    if (img) background.composite(img, 5, 5 + ((60 + 5) * index))
  })

  if (bannerImage) background.composite(bannerImage, 5 + 256 + 5, 5)

  return background
}
