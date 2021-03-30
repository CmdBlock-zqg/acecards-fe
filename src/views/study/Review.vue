<template>
  <div class="container">

    <div class="flip-container">
      <div class="flipper" :class="{ flip: status === 'back' }">
        <div class="card front">
          <span style="font-size: 1.6em; font-weight: bold;">{{ card[0] }}</span>
        </div>
        <div class="card back">
          <span class="back-title">{{ card[0] }}</span>
          <span style="font-size: 1.6em; font-weight: bold;">{{ card[1] }}</span>
        </div>
      </div>
    </div>
    <div v-if="status === 'front'" class="button-group">
      <div class="button" style="height: 44px;"></div>
      <van-button type="primary" class="button" block @click="status = 'back'">查看反面</van-button>
    </div>
    <div v-if="status === 'back'" class="button-group">
      <van-button type="success" class="button" block @click="resp(true)">记得</van-button>
      <van-button type="danger" class="button" block @click="resp(false)">不记得</van-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const Dialog = inject('vant-dialog')
const Toast = inject('vant-toast')

import db from '../../plugins/db.js'
import axios from '../../plugins/axios.js'

const router = useRouter(), route = useRoute()

const offset = (step) => {
  const Node = [0, 10, 30, 120, 300, 1800, 43200, 86400, 172800, 345600, 604800, 1296000, 2592000, 5184000, 8640000, 15552000, 300000000]
  return Node[Math.min(step, 16)]
}
const time = (offset = 0) => Math.floor(Date.now() / 1000) + offset
const sleep = (due) => new Promise((resolve) => setTimeout(resolve, due))

const id = route.params.id

var deck = null
var queue = []
var pos = 0
ref: status = 'front'
ref: card = ['', '']

const next = async () => {
  if (queue.length === 0) {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '操作中...'
    })
    await axios.put('/deck/' + id, {
      record: deck.record
    })
    await db.deck.update(deck.id, deck)

    let tmpTime = Infinity
    for (let i = 0; i < deck.record.length; i++) {
      tmpTime = Math.min(tmpTime, deck.record[i].time)
    }
    let reviewTime = await db.data.get('reviewTime')
    reviewTime = reviewTime ? reviewTime : {}
    reviewTime[id] = tmpTime
    await db.data.set('reviewTime', reviewTime)

    Toast.clear()
    Dialog.alert({
      message: '复习完成'
    })
      .then(() => router.back())
    return
  }
  pos = queue.shift()
  status = 'front'
  await sleep(150)
  card = deck.cards[pos]
}

const init = async () => {
  deck = await db.deck.get(id)
  for (let i = 0; i < deck.process; i++) {
    queue.push(i)
  }
  queue.sort(() => 0.5 - Math.random())
  await next()
}

init()

const resp = async (rem) => {
  deck.record[pos].step = rem ? deck.record[pos].step + 1 : 1
  deck.record[pos].time = time(offset(deck.record[pos].step))
  if (!rem) queue.push(pos)
  await next()
}

</script>

<style scoped>

div.flip-container {
  perspective: 1000;

  width: 100%;
  height: calc(100vh - 168px);
}

.flip {
	transform: rotateY(180deg);
}

div.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;

  position: relative;
}

div.front {
  backface-visibility: hidden;

  position: absolute;
	top: 0;
	left: 0;

  z-index: 2;
}

div.back {
  backface-visibility: hidden;

  position: absolute;
	top: 0;
	left: 0;

  transform: rotateY(180deg);
}

div.card {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 168px);
  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 6px;
  border: solid #808080 2px;
  color: #4a4a4a;
}

span.back-title {
  font-size: 1.4em;
  position: absolute;
  top: 2em;
}

div.container {
  height: calc(100vh - 48px);
  padding: 24px;
}

div.button-group {
  box-sizing: border-box;
  width: 100%;
}

.button {
  margin-top: 16px;
}
</style>