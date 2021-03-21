<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>

  <van-nav-bar
    title="我的卡组"
    @click-right="router.push('/deck/new')"
  >
    <template #right>
      <van-icon name="plus"/>
      <span class="van-nav-bar__text">新建</span>
    </template>
  </van-nav-bar>

  <div class="container">

    <font class="title">本地卡组</font>
    <div class="part-loading" v-if="loading.local">
      <van-loading color="#1989fa" size="32" />
    </div>
    <ItemCard name="3500词汇" :now="100" :tot="3500" icon="setting-o"></ItemCard>
    <van-divider />
    <font class="title">未下载卡组</font>
    <div class="part-loading" v-if="loading.remote">
      <van-loading color="#1989fa" size="32" />
    </div>
    <ItemCard name="语文背诵" :now="70" :tot="100" icon="down"></ItemCard>

  </div>
</template>

<script setup>
import { watch, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import ItemCard from '../../components/ItemCard.vue'

import db from '../../plugins/db.js'

const router = useRouter()

ref: tab = 1
watch($tab, () => {
  const path = ['/study', '/deck', '/setting']
  router.push(path[tab])
})

let loading = reactive({
  local: true,
  remote: true
})

ref: localList = []
ref: remoteList = []

onMounted(async () => {
  localList = await db.deck.getList()
  loading.local = false
})

</script>