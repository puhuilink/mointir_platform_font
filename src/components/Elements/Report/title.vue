<template>
  <div class="outer">
    <div class="abs block_blue"></div>
    <span class="abs span_7">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    name: {
      type: String,
      default: () => '接入平台'
    }
  }
}
</script>

<style scoped>
.outer {
  width: 425px;
  height: 43px;
  background: linear-gradient(90deg, #21528B 0%, rgba(21,47,87,0) 100%);
  position: relative;
}
.abs {
  position: absolute;
}
.block_blue {
  width: 5px;
  height: 20px;
  background: #00F9FF;
  left: 27px;
  top:12px;
}
.span_7 {
  width: 140px;
  height: 16px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 16px;
  left: 49px;
  top: 14px;
}
</style>
