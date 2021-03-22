import Dexie from 'dexie'

const db = new Dexie('acecards')

db.version(1).stores({
  data: 'id, value',
  deck: 'id, name, total, process, *cards, *record'
})

export default {
  clearAll: async () => {
    await db.data.clear()
    await db.deck.clear()
  },
  data: {
    set: async (key, value) => {
      await db.data.put({ id: key, value: value })
    },
    get: async (key) => {
      const data = await db.data.get(key)
      return data ? data : false
    },
    delete: async (key) => {
      await db.data.delete(key)
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
    },
    updateName: async (id, name) => {
      await db.deck.update(id, { name })
    },
    clearRecord: async (id) => {
      await db.deck.update(id, { process: 0, record: [] })
    },
    insert: async (deck) => {
      await db.deck.put({
        id: deck['_id'],
        name: deck.name,
        total: deck.total,
        process: deck.process,
        cards: deck.cards,
        record: deck.record
      })
    },
    delete: async (id) => {
      await db.deck.delete(id)
    }
  }
}