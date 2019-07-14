const assert = require('chai').assert
const onFullTeamCode = require('./onFullTeamCode')

describe('On full team code', () => {
  const bot = {
    hears: function () {}
  }
  const {
    regex
  } = onFullTeamCode(bot)
  describe('regex', () => {
    it('Should be matched', () => {
      const classless = '[1234,1234,1234,1234,1234]'
      assert.match(classless, regex)
      const classlessWithComment = '[1234,1234,1234,1234,1234] comment'
      assert.match(classlessWithComment, regex)
      const talentless = '[1234,1234,1234,1234,1234,12345]'
      assert.match(talentless, regex)
      const talentlessWithComment = '[1234,1234,1234,1234,1234,12345] comment'
      assert.match(talentlessWithComment, regex)
      const codeOnly = '[1234,1234,1234,1234,1234,1,1,1,1,1,1,1,12345]'
      assert.match(codeOnly, regex)
      assert.equal(codeOnly.match(regex)[1], '1234,1234,1234,1234,1234,1,1,1,1,1,1,1,12345')
      const withComment = '[1234,1234,1234,1234,1234,1,1,1,1,1,1,1,12345] comment'
      assert.match(withComment, regex)
      assert.equal(withComment.match(regex)[1], '1234,1234,1234,1234,1234,1,1,1,1,1,1,1,12345')
      assert.equal(withComment.match(regex)[2], 'comment')
    })
  })
})
