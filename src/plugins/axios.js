import { Toast, Dialog } from 'vant'

import db from './db.js'
import router from '../router.js'

const http = axios.create({
  baseURL: '/api'
})

http.interceptors.request.use((config) => {
  config.headers = { token: window.localStorage['token'] }
  return config
}, (error) => {
  Toast('网络错误 请检查网络是否连接')
  return Promise.reject(error)
})

http.interceptors.response.use((response) => {
  return response
}, async (error) => {
  await Dialog.alert({ message: error.response.data })
  if (error.response.status === 401) {
    await db.clearAll()
    router.push('/')
  }
  return Promise.reject(error)
})

export default http