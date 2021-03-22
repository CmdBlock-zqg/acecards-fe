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
    <template v-for="i in localList" :key="i['_id']">
      <ItemCard :name="i.name" :now="i.process" :tot="i.total" icon="setting-o"></ItemCard>
    </template>
    <van-divider />
    <font class="title">未下载卡组</font>
    <div class="part-loading" v-if="loading.remote">
      <van-loading color="#1989fa" size="32" />
    </div>
    <template v-for="i in remoteList" :key="i['_id']">
      <ItemCard :name="i.name" :now="i.process" :tot="i.total" icon="down" @click="download(i['_id'])"></ItemCard>
    </template>
  </div>
</template>

<script setup>
import { watch, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

import ItemCard from '../../components/ItemCard.vue'

import axios from'../../plugins/axios.js'
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

ref: list = []
ref: localList = []

const remoteList = computed(() => {
  const localIds = localList.map((v) => v.id)
  return list.filter((v) => !localIds.includes(v['_id']))
})

onMounted(async () => {
  localList = await db.deck.getList()
  loading.local = false
  try {
    list = (await axios.get('/deck/')).data
  } finally {
    loading.remote = false
  }
})

const download = async (id) => {
  const toast = Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '下载中...'
  })
  try {
    const { data } = await axios.get('/deck/' + id)
    await db.deck.insert(data)
    localList = await db.deck.getList()
    Toast.clear()
    Toast.success('下载成功')
  } catch {
    Toast.fail('下载失败，请检查网络连接')
  }
}

</script>