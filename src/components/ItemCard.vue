<template>
  <div class="item">
    <div class="display">
      <b style="font-size: 1.1rem;">{{ props.name }}</b>
      <van-progress style="margin-top: 1em" :percentage="props.now / props.tot * 100" :pivot-text="`${props.now}/${props.tot}`" />
    </div>
    <div class="button">
      <van-button round type="primary" style="width: 100%; height: 100%;" :icon="props.icon"></van-button>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({
    name: String,
    now: Number,
    tot: Number,
    icon: String
  })
</script>

<style scoped>
  div.item {
    border-radius: 6px;
    border: solid #808080 1px;
    color: #4a4a4a;
    display: block;
    padding: 1rem;
    margin-bottom: 1.25rem;
    height: 3rem;
  }
  div.display {
    float: left;
    width: calc(100% - 3em - 4px);
  }
  div.button {
    float: right;
    width: 3em;
    height: 100%;
    border-radius: 6px;
  }
</style>