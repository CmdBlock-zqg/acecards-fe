<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>

  <van-nav-bar
    title="学习"
  >
  </van-nav-bar>

  <div class="container">
    <span class="title">卡组</span>
    <template v-for="i in list" :key="i.id">
      <ItemCard :name="i.name" :now="i.process" :tot="i.total" icon="arrow" @click="showStudyOptions(i)"></ItemCard>
    </template>
  </div>

  <van-action-sheet
    v-model:show="studyOptions.show"
    :actions="[{ name: '智能复习' }, { name: '学习+智能复习' }, { name: '乱序逐个复习' }]"
    cancel-text="取消"
    :description="`卡组 ${studyOptions.deck.name}`"
    close-on-click-action
    @select="study"
  />

  <van-dialog v-model:show="countDialog.show" title="新学习卡片数量" show-cancel-button @confirm="confirmCount">
    <div style="padding: 24px;">
      <span>设定本次学习 <span style="color: #1989fa;">{{ studyOptions.deck.name }}</span> 中的卡片数量</span>
      <van-form style="margin-top: 10px;">
        <van-field v-model="countDialog.count" type="digit" label="数量"></van-field>
      </van-form>
    </div>
  </van-dialog>
  
</template>

<script setup>
import { watch, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'

import ItemCard from '../../components/ItemCard.vue'
const Dialog = inject('vant-dialog')

import db from '../../plugins/db.js'

const router = useRouter()

ref: tab = 0
watch($tab, () => {
  const path = ['/study', '/deck', '/settings']
  router.push(path[tab])
})

ref: list = []

const init = async () => {
  list = await db.deck.getList()
}

init()

const studyOptions = reactive({
  show: false,
  deck: { id: '', name: '' }
})

const countDialog = reactive({
  show: false,
  count: 20
})

const showStudyOptions = async (deck) => {
  studyOptions.deck = deck
  studyOptions.show = true
}

const study = async (action, index) => {
  const id = studyOptions.deck.id
  if (index === 0) { // 智能复习
    if (studyOptions.deck.process === 0) {
      Dialog.alert({
        message: '无复习内容'
      })
      return
    }
    router.push(`/study/auto/${id}?count=0`)
  } else if (index === 1) { // 学习+智能复习
    countDialog.count = 20
    countDialog.show = true
  } else if (index === 2) { // 乱序复习
    router.push(`/study/review/${id}`)
  }
}

const confirmCount = () => {
  if (Number(countDialog.count) === 0) {
    Dialog.alert({
      message: '学习卡片数不能为0'
    })
  } else {
    router.push(`/study/auto/${studyOptions.deck.id}?count=${countDialog.count}`)
  }
}

</script>