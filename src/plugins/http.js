import { Toast, Dialog } from 'vant'

import db from './db.js'
import router from '../router.js'

const baseURL = '/api'

const ajax = async (method, url, body = null) => {
  console.log(method, url, body)
  let resp
  try {
    resp = await fetch(baseURL + url, {
      method: method,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        token: window.localStorage['token']
      },
      body: body ? JSON.stringify(body) : null
    })
  } catch (err) {
    Toast('网络错误 请检查网络是否连接')
    console.log(err)
    throw err
  }
  if (resp.ok) {
    return {
      status: resp.status,
      data: await resp.json()
    }
  } else {
    const err = await resp.text()
    await Dialog.alert({ message: err })
    if (resp.status === 401) {
      await db.clearAll()
      router.push('/')
    }
    throw new Error(err)
  }
}

export default {
  get: (url) => ajax('GET', url),
  post: (url, body = null) => ajax('POST', url, body),
  put: (url, body = null) => ajax('PUT', url, body),
  delete: (url, body = null) => ajax('DELETE', url, body)
}