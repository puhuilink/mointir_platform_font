<template>
  <a-config-provider :locale="locale" :transformCellText="({ text, column, record, index }) => text||''">
    <template #renderEmpty>
      <div style="text-align: center">
      </div>
    </template>
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  }
}
</script>
<style lang="less">
  @import 'assets/less/common';
  #app {
    height: 100%;
  }
  .ant-drawer-content-wrapper{
    width: 300px !important;
  }
  .operation{
    margin-bottom: 10px;
    button{
      margin-right: 5px;
    }
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group{
  display:none !important
}

// 操作按钮样式
.operation{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
// 搜索框样式
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
