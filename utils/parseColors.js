module.exports = colors => {
  colors = parseInt(colors, 10)
  if (isNaN(colors)) return null

  const map = {
    0x400: 'blue',
    0x100: 'green',
    0x040: 'red',
    0x010: 'yellow',
    0x004: 'purple',
    0x001: 'brown'
  }

  const keys = [0x400, 0x100, 0x040, 0x010, 0x004, 0x001]

  return keys.reduce((arr, key) => {
    if (colors & key) arr.push(map[key])
    return arr
  }, [])
}
