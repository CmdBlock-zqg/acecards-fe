import Dexie from 'dexie'

const db = new Dexie('acecards')

db.version(1).stores({
  data: 'id, value',
  deck: 'id, name, total, process, *cards, *record',
  cache: 'id, opt, *field'
})

export default {
  clearAll: async () => {
    await db.data.clear()
    await db.deck.clear()
    await db.cache.clear()
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
  },
  cache: {
    setUpdate: async (id, field) => { // db.deck.setUpdate('123123', ['name', 'record', 'cards'])
      const c = await db.cache.get(id)
      if (c) {
        await db.cache.update(id, { field: field.concat(c.field.filter(v => !field.includes(v))) })
      } else {
        await db.cache.put({
          id,
          opt: 'upd',
          field
        })
      }
    },
    setDelete: async (id) => {
      const c = await db.cache.get(id)
      if (c) {
        await db.cache.update(id, { opt: 'del', field: [] })
      } else {
        await db.cache.put({ id, opt: 'del', field: [] })
      }
    },
    getList: async () => {
      return await db.cache.toArray()
    },
    synced: async (id) => {
      await db.cache.delete(id)
    }
  }
}