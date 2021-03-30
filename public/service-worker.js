this.importScripts('./sw/http.js', './sw/db.js')

var token = ''

const sync = async () => {
  const cache = await model.cache.getList()
  for (const i of cache) {
    if (i.opt === 'del') {
      try {
        await http.delete('/deck/' + i.id)
        await model.cache.synced(i.id)
      } catch(err) {
        console.log(err)
        continue
      }
    } else {
      const deck = await model.deck.get(i.id)
      let data = {}
      for (const j of i.field) {
        data[j] = deck[j]
      }
      try {
        await http.put('/deck/' + i.id, data)
        await model.cache.synced(i.id)
      } catch(err) {
        console.log(err)
        continue
      }
    }
  }
}

const timer = async () => {
  if (!this.navigator.onLine) {
    setTimeout(timer, 30000)
    return
  }
  try {
    console.log('synchronizing data')
    await sync()
  } finally {
    setTimeout(timer, 30000)
  }
}

this.addEventListener('activate', async (e) => {
  console.log('ServiceWorker activated.')
  token = await model.data.get('token')
  timer()
})

this.addEventListener('fetch', async (e) => {
  let tmp = e.request.url.indexOf('/api')
  if (tmp === -1) {
    return
  }
  const url = e.request.url.slice(tmp + 4)
  tmp = url.indexOf('/deck')
  if (tmp !== 0) {
    return
  }
  const method = e.request.method
  const id = url.slice(6)
  if (method === 'PUT') {
    const field = Object.keys(await e.request.json())
    await model.cache.setUpdate(id, field)
  } else if (method === 'DELETE') {
    await model.cache.setDelete(id)
  }
})