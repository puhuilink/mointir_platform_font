<template>
  <div class="ViewDisplay__view">
    <a-spin :spinning="loading">
      <div class="ViewDisplay__view-header">
        <a-select style="width: 300px;" v-model="selectedGroupName">
          <a-select-option
            v-for="(group, idx) in groupDesktopList"
            :key="idx"
            :value="group.view_title"
          >{{ group.view_title }}</a-select-option>
        </a-select>

        <div class="ViewDisplay__view-control">
          <a-input
            v-if="isThumbnail"
            allowClear
            autoFocus
            style="width: 200px;"
            placeholder="按视图标题搜索..."
            v-model="queryTitle"
          />
          <a-range-picker
            v-else
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DDTHH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            v-model="timeRange"
            @change="dateChange"
            @ok="dateSet" />
          <div class="ViewDisplay__view-type">
            <p class="ViewDisplay__view-button" :class="[isThumbnail && 'ViewDisplay__view-button--active']" @click="typeChange">
              <a-icon type="appstore" />
              缩略图
            </p>
            <p class="ViewDisplay__view-button" :class="[!isThumbnail && 'ViewDisplay__view-button--active']" @click="typeChange">
              <a-icon type="bars" />
              页签
            </p>
          </div>
        </div>
      </div>

      <!-- S 视图缩略图 -->
      <div class="ViewDisplay__view-content" v-if="isThumbnail">
        <a-row>
          <transition-group name="flip-list" tag="div">
            <a-col
              class="flip-item"
              v-for="viewConfig in filterViewList"
              :key="viewConfig.view_id"
              :id="viewConfig.view_id"
              :xs="24"
              :md="12"
              :lg="8"
              :xxl="6"
            >
              <div class="ViewDisplay__view-item" @click="preview(viewConfig)">
                <img :src="viewConfig.view_img | img" :alt="viewConfig.view_title">
                <div class="ViewDisplay__view-item-info">
                  <p class="ViewDisplay__view-item-info_title">{{ `${viewConfig.view_id}-${viewConfig.view_title}` }}</p>
                  <p class="ViewDisplay__view-item-info_creator">
                    <span><a-icon type="clock-circle" />{{ (viewConfig.createdate || '').replace('T', ' ') }}</span>
                    <span><a-icon type="user" />{{ viewConfig.creator }}</span>
                  </p>
                </div>
              </div>
            </a-col>

            <div class="ViewDisplay__operation flip-item" key="btn">
              <transition name="scale">
                <a-button
                  shape="circle"
                  size="large"
                  type="primary"
                  icon="plus"
                  class="ViewDisplay__operation__add scale-item"
                  v-show="selectedGroupName !== ALL_VIEW"
                  @click="editDesktop"
                  id="editDesktop"
                ></a-button>
              </transition>
            </div>
          </transition-group>
        </a-row>
      </div>
      <!-- E 视图缩略图 -->

      <!-- S 视图页签 -->
      <div class="ViewDisplay__view-tabs" :class="[isFullScreen && 'fullscreen']" v-else>
        <a-tabs
          :active-key="activeKey || filterViewList[0].view_id"
          tab-position="top"
          @change="tabsChange"
        >
          <div class="ViewDisplay__view-bar" slot="tabBarExtraContent">
            <a-tooltip placement="top" :title="isPolling ? '暂停' : '播放'">
              <a-icon :type="isPolling ? 'pause-circle' : 'play-circle'" @click="startPolling" />
            </a-tooltip>
            <a-tooltip placement="top" title="等宽">
              <a-icon type="column-width" :class="{ 'ViewDisplay__view-bar--active': scaleMode === 'fullWidth' }" @click="setScaleMode('fullWidth')"/>
            </a-tooltip>

            <a-tooltip placement="top" title="等高">
              <a-icon type="column-height" :class="{ 'ViewDisplay__view-bar--active': scaleMode === 'fullHeight' }" @click="setScaleMode('fullHeight')"/>
            </a-tooltip>

            <a-tooltip placement="top" title="拉伸">
              <a-icon type="swap" :class="{ 'ViewDisplay__view-bar--active': scaleMode === 'fullscreen' }" @click="setScaleMode('fullscreen')"/>
            </a-tooltip>

            <a-tooltip placement="top" title="原始">
              <a-icon type="pic-center" :class="{ 'ViewDisplay__view-bar--active': scaleMode === 'primary' }" @click="setScaleMode('primary')"/>
            </a-tooltip>

            <a-tooltip placement="top" title="自适应">
              <a-icon type="border-outer" :class="{ 'ViewDisplay__view-bar--active': scaleMode === 'auto' }" @click="setScaleMode('auto')"/>
            </a-tooltip>

            <a-tooltip placement="top" :title="isFullScreen ? '退出全屏' : '全屏'">
              <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="fullscreen" />
            </a-tooltip>
          </div>
          <a-tab-pane v-for="viewConfig in filterViewList" :key="viewConfig.view_id" :tab="viewConfig.view_title"></a-tab-pane>
        </a-tabs>
        <a-spin :spinning="isLoading" >
          <div class="ViewDisplay__view-tab-content" :class="[isFullScreen && 'fullscreen']" >
            <transition name="renderer">
              <Renderer v-if="view" :view="view" ref="renderer" :timeRange="timeRange" />
            </transition>
          </div>
        </a-spin>
      </div>
      <!-- E 视图页签 -->

      <!-- S 视图预览 -->
      <ViewPreview
        :showThumbnail="false"
        :timeRange="timeRange"
        :visible.sync="isVisible"
        :viewList="filterViewList"
        :currentView="targetView"
      />
      <!-- E 视图预览 -->

      <AuthDesktop
        v-if="selectedGroup"
        :visible.sync="authDesktop.visible"
        :title="selectedGroupName"
        :selectedKeys="selectedGroup.viewIds"
        :groupId="selectedGroup.group_id"
        :userId="selectedGroup.view_name"
        :desktopId="selectedGroup.view_id"
        @success="fetch"
      />

    </a-spin>
  </div>
</template>

<script>
import _ from 'lodash'
import AuthDesktop from './modules/AuthDesktop'
import ViewPreview from './modules/Preview'
import { getGroupViewDesktopList } from '@/api/controller/AuthorizeObject'
import { getUserDesktop } from '@/api/controller/ViewDesktop'
import previewImg from '@/assets/images/view__preview_default.jpg'
import Renderer from '@/components/Renderer'
import { ViewDesignService } from '@/api-hasura'

const ALL_VIEW = '所有视图'

export default {
  name: 'ViewDisplay',
  components: {
    AuthDesktop,
    ViewPreview,
    Renderer
  },
  filters: {
    img (img) {
      return img ? `${process.env.VUE_APP_VIEW_THUMBNAIL_URI}/${img}` : previewImg
    }
  },
  data () {
    return {
      loading: false,
      groupDesktopList: [],
      viewLists: [],
      filterViewList: [],
      queryTitle: '',
      selectedGroupName: ALL_VIEW,
      previewImg,
      isVisible: false,
      targetView: null,
      ALL_VIEW,
      authDesktop: {
        visible: false
      },
      activeKey: null,
      // 缩略图模式
      isThumbnail: true,
      isLoading: false,
      isFullScreen: false,
      isPolling: false,
      view: null,
      index: 0,
      timer: null,
      timeRange: []
    }
  },
  computed: {
    scaleMode: {
      get: function () {
        return this.view ? _.get(this.view, 'config.proprietaryConfig.scaleMode') : 'auto'
      },
      set: function (mode) {
        Object.assign(this.view.config.proprietaryConfig, {
          scaleMode: mode
        })
      }
    },
    selectedGroup () {
      const { selectedGroupName, groupDesktopList } = this
      return groupDesktopList.length ? groupDesktopList.find(({ view_title }) => view_title === selectedGroupName) : []
    },
    filterViewListOption () {
      const { selectedGroup, viewLists, queryTitle } = this
      return { selectedGroup, viewLists, queryTitle }
    }
  },
  watch: {
    filterViewListOption: {
      immediate: true,
      deep: true,
      handler: _.debounce(function () {
        /**
         * 筛选出符合条件的视图列表
         */
        const { selectedGroup, viewLists } = this
        let list = []
        // 分组筛选条件
        if (selectedGroup.view_title === ALL_VIEW) {
          list = viewLists
        } else {
          list = this.viewLists.filter(({ view_id }) => selectedGroup.viewIds.includes(`${view_id}`))
        }
        // 加上搜索条件，当 input allowClear 时，title 为 undefined
        list = list.filter(({ view_title, view_id }) => {
          const value = (this.queryTitle || '').trim().toLowerCase()
          const id = `${view_id}`.toLowerCase()
          const title = `${view_title}`.toLowerCase()
          return `${id}-${title}`.includes(value)
        })
        list = _.uniqBy(list, e => e.view_id)

        this.filterViewList = list
      }, 30)
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const [
          [groupDesktopViewList, groupDesktopList],
          [selfDesktopViewList, selfDesktop]
        ] = await Promise.all([
          getGroupViewDesktopList(),
          getUserDesktop(this.$store.state.user.info.userId)
        ])
        this.viewLists = [
          ...groupDesktopViewList,
          ...selfDesktopViewList
        ]
        this.groupDesktopList = [
          ...groupDesktopList,
          selfDesktop,
          {
            view_title: ALL_VIEW
          }
        ]
      } catch (e) {
        this.viewLists = []
        this.groupDesktopList = []
        throw e
      } finally {
        this.loading = false
      }
    },
    editDesktop () {
      this.authDesktop.visible = true
    },
    preview (view) {
      this.isVisible = true
      this.targetView = view
    },
    dateChange (date) { },
    dateSet (date) { },
    typeChange () {
      this.isThumbnail = !this.isThumbnail
      if (!this.isThumbnail) {
        this.tabsChange(this.filterViewList[0].view_id)
      } else {
        clearInterval(this.timer)
      }
    },
    async tabsChange (id) {
      try {
        this.activeKey = id
        this.view = null
        this.isLoading = true
        this.view = await ViewDesignService.getDesign(id)
      } catch (e) {
        this.view = null
        throw e
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 开启全屏
     */
    fullscreen () {
      this.isFullScreen = !this.isFullScreen
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    /**
     * 设置缩放模式
     * @param scaleMode
     */
    setScaleMode (scaleMode) {
      this.scaleMode = scaleMode
      this.$refs.renderer.setScaleMode()
    },
    /**
     * 根据编号获取视图
     */
    getIndexView () {
      // 清空先前的数据
      this.view = null
      const length = this.filterViewList.length
      if (this.index < 0) {
        this.index = length - 1
      } else if (this.index > length - 1) {
        this.index = 0
      }
      const view = this.filterViewList[this.index]
      this.tabsChange(view.view_id)
    },
    /**
     * 开启轮训
     */
    startPolling () {
      this.isPolling = !this.isPolling
      clearInterval(this.timer)
      // 开启定时器。每分钟切换视图
      if (this.isPolling) {
        this.timer = setInterval(() => {
          if (this.isPolling) {
            this.index += 1
            this.getIndexView()
          }
        }, 1000 * 6)
      }
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less" scoped>

  .ViewDisplay__view {
    position: relative;

    &-header {
      padding: 12px 22px 14px 22px;
      // 父元素给了 24px 的左右 margin，当 header 吸顶时两侧会有留白，此处给占满宽度
      margin: 0 -24px 0 -24px;
      width: calc(100% + 48px);
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 64px;
      background-color: rgb(255, 255, 255);
      z-index: 9;
      overflow: hidden;
    }

    &-control {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
    }

    &-type {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      margin-left: 24px;
    }

    &-button {
      flex: none;
      height: 32px;
      width: 96px;
      cursor: pointer;
      color: rgba(0, 0, 0, .67);
      line-height: 32px;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, .23);
      margin: 0;

      &:nth-of-type(1) {
        border-right: none;
        border-radius: 5px 0 0 5px;
      }

      &:nth-of-type(2) {
        border-left: none;
        border-radius: 0 5px 5px 0;
      }

      &--active {
        background: #1890ff;
        border: none;
        color: white;
      }
    }

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
    }

    &-spin {
      width: 100%;
      height: calc(100vh - 230px);
    }

    &-tabs.fullscreen {
      position: fixed;
      height: 100vh;
      width: 100vw;
      top: 0;
      left: 0;
      z-index: 1000;
      background: white;
    }

    &-tab-content {
      width: 100%;
      height: calc(100vh - 230px);
      overflow: auto;
    }

    &-tab-content.fullscreen {
      height: 100%;
    }

    &-item {
      box-sizing: border-box;
      // 给定宽高，避免图片加载等过程中导致重绘
      // width: 363px;
      // height: 259px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 0 32px #f0f0f0;
      transform: scale(1);
      transition: transform .4s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.03);
        transition: transform .4s ease;
      }

      img {
        display: block;
        width: 100%;
        height: 143px;
        border-radius: 4px;
      }

      &-info {
        padding: 12px;
        padding-bottom: 0;

        &_title {
          font-family: 微软雅黑;
          font-size: 16px;
          font-weight: bold;
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          color: rgb(51, 51, 51);
          overflow: hidden;
          margin: 0px 0px 8px;
        }

        &_creator {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          span {
            line-height: 12px;
            overflow: hidden;
            margin: 2px 0 2px 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            background-repeat: no-repeat;
            background-size: contain;
            font-family: 微软雅黑;
            font-size: 12px;
            color: rgb(124, 132, 145);
          }
        }
      }
    }
  }

  .ViewDisplay {

    &__operation {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 8px;
    }
  }

  .renderer-enter-active, .renderer-leave-active {
    transition: opacity 300ms ease-in-out;
  }
  .renderer-enter, .renderer-leave-to {
    opacity: 0;
  }

  .move {
    transition: transform 1s;
  }

  .flip-item {
    padding: 7px;
    background-color: #fff;
    z-index: 1;
    transition: all 1s;
  }

  .flip-list-enter {
    z-index: 2;
  }

  .flip-list-enter,
  .flip-list-leave-to {
    opacity: 0;
    transform: translateY(100%)
  }

  .flip-list-leave-active {
    position: absolute;
  }

  .scale-item {
    transition: all 1s;
  }

  .scale-enter,
  .scale-leave-to {
    opacity: 0;
    transform: scale(0);
  }

</style>

<style>
.pause {
  animation-play-state: paused !important;
}
</style>