<template>
  <div class="outer_1">
    <!--    黄块-->
    <div class="block_yellow abs"></div>
    <span class="font_blue abs">基础资源监控</span>
    <span class="font_white abs" style="left: 77px;top: 81px;">云上UC-Center</span>
    <span class="font_white abs" style="left: 219px; top: 81px;">云下Pigoss</span>
    <a href="www.baidu.com" target="_blank"><img src="./img/pigoss.png" style="left: 84px;top: 35px;" class="abs sign"></a>
    <a href="www.baidu.com" target="_blank"><img src="./img/pigoss.png" style="left: 225px;top: 35px;" class="abs sign"></a>
  </div>
</template>

<script>
export default {
  name: 'PlatForm'
}
</script>

<style scoped>
.outer_1 {
  width: 388px;
  height: 112px;
  background-image: url('img/box_bk01.png');
  position: relative;
}
.abs {
  position: absolute;
}
.block_yellow {
  width: 2px;
  height: 12px;
  background: #FFC300;
  top: 8px;
  left: 14px;
}

.font_blue {
  width: 72px;
  height: 14px;
  font-size: 12px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #6CD5FF;
  line-height: 14px;
  left: 23px;
  top:6px;
}

.font_white {
  width: 101px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
}

.sign {
  width: 86px;
  height: 40px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #EFF1F2;
}
.sign:hover {
  box-shadow: 2px 3px 2px 0px #BEBBBB;
  margin: 5px;
}
</style>
