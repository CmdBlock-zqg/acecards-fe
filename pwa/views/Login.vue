<template>
  <div v-if="status === 2">
    <p class="message">登陆中...</p>
  </div>
  <div v-if="status === 1" class="container">
    <div class="login">
      <font class="title">AceCards</font>
      <font class="subtitle">卡片式记忆APP</font>
      <van-button type="primary" block class="button" @click="aauth">登录</van-button>
      <van-button type="primary" block plain class="button" @click="offline">离线体验</van-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import db from '../plugins/db.js'
import axios from '../plugins/axios.js'

const router = useRouter(), route = useRoute()

ref: status = 0

onMounted(async () => {
  const token = await db.data.get('token')
  if (token) {
    router.push('/study')
    return
  }
  if (route.query.code) {
    status = 2
    const { data } = await axios.post('/login', { code: route.query.code })
    await db.data.set('token', data)
    router.push('/study')
    return
  }
  status = 1
})

const aauth = () => {
  window.location.href = 'https://aauth.link/#/launch/44pd4z9iwn85kxqb6v2rgxdqdq8dtfrow'
}

const offline = async () => {
  await db.data.set('token', 'OFFLINE')
  router.push('/study')
}

</script>

<style scoped>
  p.message {
    margin: 0;
    text-align: center;
    line-height: 100vh;
    font-size: 32px;
  }
  div.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div.login {
    box-sizing: border-box;
    width: 100%;
    padding: 15%;
    position: relative;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  font.title {
    font-size: 36px;
    margin-bottom: 20px;
  }
  font.subtitle {
    font-size: 20px;
    margin-bottom: 60px;
  }
  .button {
    max-width: 300px;
    margin-bottom: 20px;
  }
</style>