<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
  <div class="page-loading" v-if="loading">
    <van-loading color="#1989fa" size="50" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

ref: tab = 0
watch($tab, () => {
  const path = ['/study', '/deck', '/settings']
  router.push(path[tab])
})

ref: loading = true

</script>