this.importScripts('./sw/http.js', './sw/db.js', './sw/webcache.js')

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

const notify = async () => {
  const reviewTime = await model.data.get('reviewTime')
  const time = Math.floor(Date.now() / 1000)
  let count = 0
  for (const i of Object.keys(reviewTime)) {
    count += time >= reviewTime[i]
  }
  if (count !== 0) {
    new Notification('你有新的复习任务', {
      body: '待复习卡组数: ' + count,
      tag: 'review',
      icon: '/images/192.png'
    })
  }
}

const timer = async () => {
  if (!this.navigator.onLine) {
    setTimeout(timer, 300000)
    return
  }
  try {
    await notify()
    await sync()
  } finally {
    setTimeout(timer, 300000)
  }
}

this.addEventListener('activate', async (e) => {
  console.log('[sw] activated.')
  token = await model.data.get('token')
  timer()
})

this.addEventListener('fetch', async (e) => {
  let tmp = e.request.url.indexOf('/api')
  if (tmp === -1) {
    e.respondWith(
      caches.match(e.request).then((r) => {
        return r || fetch(e.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(e.request, response.clone())
            return response
          })
        })
      })
    )
    return
  }
  if (this.navigator.onLine) {
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
  e.respondWith(async () => {
    return new Response('已缓存')
  })
})