<template>
  <div class="outer abs">
    <plat class="abs" style="left: 52px;top:32px;"></plat>
    <plat
      class="abs"
      style="left: 482px;top:32px;"
      title="应用性能监控"
      font-first="博瑞APM"
      font-second="云智慧"
      img-first="bonree.png"
      img-second="clond.png"/>
    <plat
      class="abs"
      style="left: 52px;top:174px;"
      title="机房监控"
      font-first="共济科技"
      font-second="飞思安诺"
      img-first="her.png"
      img-second="free.png"/>
    <plat
      class="abs"
      style="left: 482px;top:174px;"
      title="网络性能监控"
      font-first="天旦NPM/BPC"
      font-second="科来NPM"
      img-first="tiandan.png"
      img-second="kelai.png"/>
  </div>
</template>

<script>
import plat from '~~~/Elements/Report/platForm'
export default {
  name: 'ColorMask',
  components: {
    plat
  }
}
</script>

<style scoped>
.outer {
  width: 930px;
  height: 328px;
  background: linear-gradient(360deg, rgba(33,82,139,0.49) 0%, rgba(21,47,87,0) 100%);
  position: relative;
}
.abs {
  position: absolute;
}
</style>
