<template>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const Dialog = inject('vant-dialog')

import db from '../../plugins/db.js'

const router = useRouter(), route = useRoute()

const id = route.params.id
const count = route.query.count

ref: deck = null

const init = async () => {
  deck = await db.deck.get(id)
  console.log(deck, id, count)
}

init()

</script>
