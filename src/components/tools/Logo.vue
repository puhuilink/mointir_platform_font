<template>
  <div class="logo">
    <router-link :to="{ name: 'view' }">
      <img :src="logo" alt="" />
      <h1 v-if="showTitle" class="logo__title">统一告警平台</h1>
    </router-link>
  </div>
</template>

<script>
import { ThemeService } from '@/api'

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '统一告警平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      logo: require('@/assets/logo.png'),
      titleName: ''
    }
  },
  methods: {
    async getTheme () {
      // 读取当前主题
      try {
        const { logo, name } = await ThemeService.fetchTheme()
        if (logo) this.logo = logo
        if (name) this.titleName = name
      } catch (error) {
        this.$message.error('主题请求异常!' + error)
      }
    }
  },
  created () {
    // this.getTheme()
  }
}
</script>
<style scoped lang="less">
.logo {
  line-height: 1;
  transform: translateY(-2px);

  img {
    width: 30px;
    height: 30px;
  }

  &__title {
    margin: 0 0 0 6px !important;
    font-family: arial, 'Microsoft Yahei', 'Hiragino Sans GB', sans-serif !important;
    font-weight: 100;
    font-size: 16px !important;
    /*font-weight: normal !important;*/
  }
}
</style>
