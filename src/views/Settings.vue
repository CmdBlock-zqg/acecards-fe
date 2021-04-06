<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
  
  <div style="padding: 24px 16px;">
    <h1 class="username">{{ name }}</h1>
      <van-cell-group>
        <van-cell
          title="同步服务器信息"
          :label="'服务器信息状态：' + cacheStateText"
          size="large"
          clickable
          @click="sync"
        />
        <van-cell style="color: #ee0a24" title="退出登录" clickable @click="logout"/>
    </van-cell-group>
  </div>
</template>

<script setup>
import { watch, inject } from 'vue'
import { useRouter } from 'vue-router'

const Dialog = inject('vant-dialog')
const Toast = inject('vant-toast')

import db from '../plugins/db.js'
import axios from '../plugins/axios.js'

const router = useRouter()

ref: tab = 2
watch($tab, () => {
  const path = ['/study', '/deck', '/settings']
  router.push(path[tab])
})

const name = window.localStorage.name

var cache = null
ref: cacheStateText = '检测中...'
const init = async () => {
  cache = await db.cache.getList()
  cacheStateText = cache.length === 0 ? '已同步' : '未同步'
}

init()

const sync = async () => {
  Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '同步中...'
  })
  for (const i of cache) {
    if (i.opt === 'del') {
      try {
        await axios.delete('/deck/' + i.id)
        await db.cache.synced(i.id)
      } catch(err) {
        Toast.clear()
        Toast.fail('同步失败，请检查网络连接')
        await init()
        return
      }
    } else {
      const deck = await db.deck.get(i.id)
      let data = {}
      for (const j of i.field) {
        data[j] = deck[j]
      }
      try {
        await axios.put('/deck/' + i.id, data)
        await db.cache.synced(i.id)
      } catch(err) {
        Toast.clear()
        Toast.fail('同步失败，请检查网络连接')
        await init()
        return
      }
    }
  }
  Toast.clear()
  Toast.success('同步完成')
  await init()
}

const logout = () => {
  Dialog.confirm({
    title: '你确认退出登录吗？',
    message: '登出后，本地信息将被全部清除，离线状态下未提交到服务器的信息将丢失。'
  })
    .then(async () => {
      await db.clearAll()
      window.location.href = '/#/'
    })
    .catch(() => { return })
}
</script>
