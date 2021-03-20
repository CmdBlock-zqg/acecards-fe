import Dexie from 'dexie'

const db = new Dexie('acecards')

db.version(1).stores({
  data: 'id, value'
})

export default {
  data: {
    set: async (key, value) => {
      await db.data.put({ id: key, value: value })
    },
    get: async (key) => {
      return db.data.get(key)
    }
  }
}