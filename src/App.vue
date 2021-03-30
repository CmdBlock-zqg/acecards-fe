<template>
  <div style="margin: 0 auto; max-width: 500px;">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { Dialog, Toast } from 'vant'

provide('vant-toast', Toast)
provide('vant-dialog', Dialog)

</script>

<style src="./components/common.css"></style>