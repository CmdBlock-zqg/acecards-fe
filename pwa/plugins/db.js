import Dexie from 'dexie'

const db = new Dexie('acecards')

db.version(1).stores({
  data: 'id, value',
  deck: 'id, name, total, process, *cards, *record'
})

export default {
  data: {
    set: async (key, value) => {
      await db.data.put({ id: key, value: value })
    },
    get: async (key) => {
      return (await db.data.get(key)).value
    }
  },
  deck: {
    getList: async () => {
      return await db.deck.toArray()
    },
    getCards: async (id) => {
      const deck = await db.deck.get(id)
      return deck ? deck.cards : false
    },
    getRecord: async (id) => {
      const deck = await db.deck.get(id)
      return deck ? deck.record : false
    }
  }
}