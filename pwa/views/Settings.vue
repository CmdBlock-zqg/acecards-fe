<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>

  <van-nav-bar
    title="设置"
  >
  </van-nav-bar>

  <div style="padding: 24px 16px;">
    <h1 class="username">{{ name }}</h1>
      <van-cell-group>
        <van-cell title="同步服务器信息" clickable/>
        <van-cell style="color: #ee0a24" title="退出登录" clickable @click="logout"/>
    </van-cell-group>
  </div>
</template>

<script setup>
import { watch, inject } from 'vue'
import { useRouter } from 'vue-router'

const Dialog = inject('vant-dialog')

import db from '../plugins/db.js'

const router = useRouter()

ref: tab = 2
watch($tab, () => {
  const path = ['/study', '/deck', '/settings']
  router.push(path[tab])
})

const name = window.localStorage.name

const logout = () => {
  Dialog.confirm({
    title: '你确认退出登录吗？',
    message: '登出后，本地信息将被全部清除，离线状态下未提交到服务器的信息将丢失，离线模式的所有数据都将消失。'
  })
    .then(async () => {
      await db.clearAll()
      window.location.href = '/pwa/#/'
    })
    .catch(() => { return })
}
</script>
