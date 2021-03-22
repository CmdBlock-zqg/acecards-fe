<template>
  <div style="margin: 0 auto; max-width: 500px;">
    <router-view v-if="status"></router-view>
  </div>
</template>

<script setup>
import { provide, nextTick } from 'vue'

ref: status = true

provide('refresh', () => {
  status = false
  nextTick(() => {
    status = true
  })
})

</script>

<style src="./components/common.css"></style>