<script>
import _ from 'lodash'
import { fromEvent } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { toggleFullscreen } from '@/utils/util'

export default {
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    // 是否自动切换视图
    isAutoPlay: false,
    isFullScreen: false,
    isSubscribed: true,
    // 当前正在播放的视图下标
    index: 0,
    // 当前正在预览的视图
    view: null
  }),
  computed: {
    // 预览页面缩放模式
    scaleMode: {
      get () {
        return _.get(this.view, ['config', 'proprietaryConfig', 'scaleMode'], 'auto')
      },
      set (scaleMode) {
        _.set(this.view, ['config', 'proprietaryConfig', 'scaleMode'], scaleMode)
      }
    }
  },
  methods: {
    /**
     * 设置缩放模式
     * @param scaleMode
     */
    setScaleMode (scaleMode) {
      this.scaleMode = scaleMode
      this.$refs.renderer.setScaleMode()
    },
    /**
     * 切换全屏
     */
    toggleFullscreen () {
      this.isFullScreen = !this.isFullScreen
      toggleFullscreen()
    },
    /**
     * 切换自动播放
     */
    toggleAutoPlay () {
      this.isAutoPlay = !this.isAutoPlay
      clearInterval(this.timer)
      // 开启定时器。每分钟切换视图
      if (this.isAutoPlay) {
        this.timer = setInterval(() => {
          // 运行时
          if (this.isAutoPlay) {
            this.index += 1
            this.getViewByIndex()
          }
        }, 1000 * 6)
      }
    }
  },
  mounted () {
    this.isFullScreen = !!document.fullscreenElement
    fromEvent(document, 'fullscreenchange')
      .pipe(
        takeWhile(() => this.isSubscribed)
      )
      .subscribe(event => {
        this.isFullScreen = !!document.fullscreenElement
      })
  },
  beforeDestroy () {
    this.isSubscribed = false
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.PreviewMixin {
  &-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    height: 45px;
    width: 240px;

    & i {
      font-size: 18px;
    }

    &--active {
      color: #1890ff !important;
    }

    &__fullscreen {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-evenly;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: calc(50% - 300px);
      height: 48px;
      width: 600px;
      background: #636872;
      border-radius: 48px 48px 0 0;
      transform: translateY(37px);
      transition: transform .3s;
      z-index: 201;

      &:hover {
        transform: translate(0);
        transition: transform .3s;
      }

      & > i {
        font-size: 24px;
        color: white;
        cursor: pointer;

        &:hover {
          color: lighten(#1890ff, 10%);
        }

        &:active {
          color: #1890ff;
        }
      }

      &--active {
        color: #1890ff !important;
      }
    }
  }
}
</style>
