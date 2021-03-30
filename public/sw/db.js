this.importScripts('https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.min.js')

const db = new Dexie('acecards')
db.version(1).stores({
  data: 'id, value',
  deck: 'id, name, total, process, *cards, *record',
  cache: 'id, opt, *field'
})

const model = {
  data: {
    get: async (key) => {
      const data = await db.data.get(key)
      return data ? data.value : false
    }
  },
  deck: {
    get: async (id) => {
      const deck = await db.deck.get(id)
      return deck
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