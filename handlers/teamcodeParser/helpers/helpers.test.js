const assert = require('chai').assert
const sinon = require('sinon')

describe('On full team code', () => {
  const {
    getTroopIds,
    getKingdomId,
    getTalentIndices,
    getClassId,
    findTroops,
    findKingdom,
    findHeroClass
  } = require('./index')

  describe('helpers', () => {
    it('getTroopIds should return correct troop ids.', () => {
      const codes = ['1111', '2222', '3333', '4444', '5555']
      const ids = getTroopIds(codes)
      assert.isArray(ids)
      assert.deepEqual(ids, [1111, 2222, 3333, 4444])
    })

    it('getKingdomId should return correct kingdom id.', () => {
      const codes = ['1111', '2222', '3333', '4444', '5555']
      const id = getKingdomId(codes)
      assert.equal(id, 5555)
    })

    it('getTalentIndices should return correct tanlent indices.', () => {
      const codes = ['1111', '2222', '3333', '4444', '5555', '1', '2', '3', '4', '5', '6', '7', '12345']
      const indices = getTalentIndices(codes)
      assert.isArray(indices)
      assert.deepEqual(indices, [1, 2, 3, 4, 5, 6, 7])

      const codes2 = ['1111', '2222', '3333', '4444', '5555', '12345']
      const indices2 = getTalentIndices(codes2)
      assert.isNull(indices2)

      const codes3 = ['1111', '2222', '3333', '4444', '5555']
      const indices3 = getTalentIndices(codes3)
      assert.isNull(indices3)
    })

    it('getClassId should return correct class id.', () => {
      const codes = ['1111', '2222', '3333', '4444', '5555', '1', '2', '3', '4', '5', '6', '7', '12345']
      const id = getClassId(codes)
      assert(id, 12345)
      const codes2 = ['1111', '2222', '3333', '4444', '5555', '12345']
      const id2 = getClassId(codes2)
      assert(id2, 12345)
      const codes3 = ['1111', '2222', '3333', '4444', '5555']
      const id3 = getClassId(codes3)
      assert.isNull(id3)
    })
  })

  describe('finders', () => {
    describe('findKingdom', () => {
      const Kingdom = require('../../../models/kingdoms')
      const kingdomId = 1111

      afterEach(() => {
        sinon.restore()
      })

      it('Should return kingdom without error', () => {
        sinon.stub(Kingdom, 'findById').resolves({})

        return findKingdom(kingdomId)
          .then(({ kingdom, error }) => {
            assert.typeOf(kingdom, 'object')
            assert.isNull(error)
          })
      })

      it('Should return kingdom with error', () => {
        sinon.stub(Kingdom, 'findById').resolves(null)

        return findKingdom(kingdomId)
          .then(({ kingdom, error }) => {
            assert.typeOf(kingdom, 'object')
            assert.isNotNull(error)
          })
      })
    })
    describe('findHeroClass', () => {
      const Class = require('../../../models/classes')

      afterEach(() => {
        sinon.restore()
      })

      it('Should return class without error', () => {
        sinon.stub(Class, 'findById').resolves({})

        return findHeroClass(1234)
          .then(({ heroClass, error }) => {
            assert.isNotNull(heroClass)
            assert.isNull(error)
          })
      })

      it('Should return class with error', () => {
        sinon.stub(Class, 'findById').resolves(null)

        return findHeroClass(1234)
          .then(({ heroClass, error }) => {
            assert.isNotNull(heroClass)
            assert.isNotNull(error)
          })
      })
    })
    describe('findTroops', () => {
      const Card = require('../../../models/cards')
      const troopIds = [1111, 2222, 3333, 4444]

      afterEach(() => {
        sinon.restore()
      })

      it('Should return troops without errors', (done) => {
        sinon.stub(Card, 'findById').resolves({})

        findTroops(troopIds)
          .then(({ troops, errors }) => {
            assert.isArray(troops)
            assert.lengthOf(troops, 4)
            assert.isNull(errors)
            done()
          })
      })

      it('Should return troops with errors', (done) => {
        sinon.stub(Card, 'findById').resolves(null)

        findTroops(troopIds)
          .then(({ troops, errors }) => {
            assert.isArray(troops)
            assert.lengthOf(troops, 4)
            assert.isArray(errors)
            assert.lengthOf(errors, 4)
            done()
          })
      })
    })
  })
})
