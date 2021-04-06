<template>
  <van-tabbar v-model="tab">
    <van-tabbar-item icon="todo-list-o">学习</van-tabbar-item>
    <van-tabbar-item icon="pending-payment">卡组</van-tabbar-item>
    <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>

  <div class="container">
    <van-button
      block
      hairline
      plain
      icon="plus"
      size="small"
      style="margin-bottom: 16px;"
      type="primary"
      @click="router.push('/deck/new')"
    >新建卡组</van-button>

    <span class="title">本地卡组</span>
    <template v-for="i in localList" :key="i.id">
      <ItemCard :name="i.name" :now="i.process" :tot="i.total" icon="setting-o" @click="showSettings(i)"></ItemCard>
    </template>
    <van-divider />
    <span class="title">未下载卡组</span>
    <div class="part-loading" v-if="loading">
      <van-loading color="#1989fa" size="32" />
    </div>
    <template v-for="i in remoteList" :key="i['_id']">
      <ItemCard :name="i.name" :now="i.process" :tot="i.total" icon="down" @click="download(i['_id'])"></ItemCard>
    </template>
  </div>

  <van-action-sheet
    v-model:show="setting.show"
    :actions="[{ name: '重命名' }, { name: '重置进度',  color: '#ee0a24' }, { name: '从本地删除', color: '#ed6a0c' }, { name: '彻底删除', color: '#ee0a24' }]"
    cancel-text="取消"
    :description="`设置 ${setting.deck.name}`"
    close-on-click-action
    @select="act"
  />

  <van-dialog v-model:show="setting.rename.show" title="重命名卡组" show-cancel-button :before-close="updateName">
    <div style="padding: 24px;">
      <span>重命名卡组 <span style="color: #1989fa;">{{ setting.deck.name }}</span></span>
      <van-form style="margin-top: 10px;" :disabled="setting.rename.lock">
        <van-field v-model="setting.rename.name" label="新卡组名"></van-field>
      </van-form>
    </div>
  </van-dialog>

</template>

<script setup>
import { watch, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

const Toast = inject('vant-toast')
const Dialog = inject('vant-dialog')

import ItemCard from '../../components/ItemCard.vue'

import axios from'../../plugins/axios.js'
import db from '../../plugins/db.js'

const router = useRouter()

ref: tab = 1
watch($tab, () => {
  const path = ['/study', '/deck', '/settings']
  router.push(path[tab])
})

ref: loading = true

ref: list = []
ref: localList = []

const remoteList = computed(() => {
  const localIds = localList.map((v) => v.id)
  return list.filter((v) => !localIds.includes(v['_id']))
})

const init = async () => {
  loading = true
  localList = await db.deck.getList()
  try {
    list = (await axios.get('/deck')).data
  } finally {
    loading = false
  }
}

init()

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
    Toast.clear()
    Toast.fail('下载失败，请检查网络连接')
  }
}

const setting = reactive({
  show: false,
  deck: { id: '', name: '' },
  rename: {
    show: false,
    name: '',
    lock: false
  }
})

const showSettings = (deck) => {
  setting.deck = deck
  setting.show = true
}

const act = (action, index) => {
  if (index === 0) { // rename
    setting.rename.name = setting.deck.name
    setting.rename.show = true
    setting.rename.lock = false
  } else if (index === 1) { // clear rec
    Dialog.confirm({
      title: '确认重置学习进度？',
      message: '您的学习进度将从头开始，无法恢复。'
    })
      .then(async () => {
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: '操作中...'
        })
        await axios.put('/deck/' + setting.deck.id, {
          record: []
        })
        await db.deck.clearRecord(setting.deck.id)
        localList = await db.deck.getList()
        Toast.clear()
      })
      .catch(() => { return })
  } else if (index === 2) { // del local
    Dialog.confirm({
      title: '确认从本地删除卡组？',
      message: '您的数据不会丢失，稍后可以从服务器下载（离线登录除外）。'
    })
      .then(async () => {
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: '操作中...'
        })
        await db.deck.delete(setting.deck.id)
        localList = await db.deck.getList()
        Toast.clear()
      })
      .catch(() => { return })
  } else if (index === 3) { // del remote
    Dialog.confirm({
      title: '确认从彻底删除卡组？',
      message: '卡组将从本地和服务器一并被删除，无法找回。'
    })
      .then(async () => {
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: '操作中...'
        })
        await axios.delete('/deck/' + setting.deck.id)
        await db.deck.delete(setting.deck.id)
        Toast.clear()
        await init()
      })
      .catch(() => { return })
  }
}

const updateName = async (action) => {
  if (action === 'cancel') {
    if (!setting.rename.lock) setting.rename.show = false
    return
  }
  if (!setting.rename.name) {
    Toast('请输入卡组名称')
    return
  }
  setting.rename.lock = true
  const toast = Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '操作中...'
  })
  try {
    await axios.put('/deck/' + setting.deck.id, {
      name: setting.rename.name
    })
    await db.deck.update(setting.deck.id, { name: setting.rename.name })
    Toast.clear()
    Toast.success('操作成功')
  } catch {
    Toast.clear()
    Toast.fail('操作失败，请检查网络连接')
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await init()
    setting.rename.show = false
  }
}

</script>