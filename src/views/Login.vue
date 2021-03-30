<template>
  <div v-if="status === 2">
    <p class="message">登陆中...</p>
  </div>
  <div v-if="status === 1" class="container">
    <div class="login">
      <span class="title">AceCards</span>
      <span class="subtitle">卡片式记忆APP</span>
      <van-button type="primary" block class="button" @click="aauth">登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const Dialog = inject('vant-dialog')

import db from '../plugins/db.js'
import axios from '../plugins/axios.js'

const router = useRouter(), route = useRoute()

ref: status = 0

const init = async () => {
  const token = await db.data.get('token')
  if (token) {
    window.localStorage['token'] = token
    window.localStorage['name'] = token.split('.')[2]
    router.push('/study')
    return
  }
  if (route.query.code) {
    status = 2
    const { data } = await axios.post('/login', { code: route.query.code })
    const name = data.split('.')[2]
    await db.data.set('token', data)
    await db.data.set('name', name)
    window.localStorage['token'] = data
    window.localStorage['name'] = name
    router.push('/study')
    return
  }
  status = 1
}

init()

const aauth = () => {
  window.location.href = 'https://aauth.link/#/launch/44pd4z9iwn85kxqb6v2rgxdqdq8dtfrow'
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
    box-sizing: border-box;
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
  span.title {
    font-size: 36px;
    margin-bottom: 20px;
  }
  span.subtitle {
    font-size: 20px;
    margin-bottom: 60px;
  }
  .button {
    max-width: 300px;
    margin-bottom: 20px;
  }
</style>