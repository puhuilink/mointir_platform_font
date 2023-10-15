<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="bg-image" :style="{ backgroundImage: `url(${bgImage})` }"></div>
    <div class="filter"></div>
    <div class="container">
      <div class="top">
        <div class="header">
          <img class="logo" alt="logo" src="@/assets/logo.png"/>
          <span class="title">统一监控管理平台</span>
          <!--          <p class="small">Visualization and Insight for Your Business and Environment</p>-->
        </div>
        <div class="desc"></div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <div class="copyright">Copyright &copy; {{ new Date().getFullYear() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { ThemeService } from '@/api/service/ThemeService'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      bgImage: require('@/assets/images/bg-login-compress.jpg'),
      title: '',
      logoIndex: ''
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
    // this.getTheme()
  },
  methods: {
    async getTheme () {
      // 读取当前主题
      try {
        const theme = await ThemeService.fetchTheme()
        if (theme) {
          const {
            bg_image,
            settings: { primaryColor },
            name,
            logo
          } = theme
          this.bgImage = bg_image
          this.title = name
          this.$refs.imgLogo.src = logo
          this.$store.dispatch('ToggleColor', primaryColor)
        }
      } catch (error) {
        this.$message.error('主题请求异常!' + error)
      }
    }
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    padding: 180px 0 144px;
    padding: 90px 0 0;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        // height: 44px;
        line-height: 44px;
        position: absolute;
        left:50%;
        top:25%;
        transform: translate(-50%, -50%);

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: white;
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }

        .small {
          font-size: 12px;
          color: white;
        }
      }
      .desc {
        font-size: 14px;
        color: white;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 400px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .copyright {
        color: white;
        font-size: 14px;
      }
    }
  }

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.5);
  }

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 1132px;
    height: 100%;
    background-color: #f0f2f5;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
  }
}
</style>
