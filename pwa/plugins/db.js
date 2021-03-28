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
      return data ? data.value : false
    },
    delete: async (key) => {
      await db.data.delete(key)
    }
  },
  deck: {
    getList: async () => {
      return await db.deck.toArray()
    },
    get: async (id) => {
      const deck = await db.deck.get(id)
      return deck
    },
    update: async (id, deck) => {
      await db.deck.update(id, deck)
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