<template>
  <div class="ViewDisplay">
    <a-spin :spinning="isLoadingDesktopConfig">
      <div class="ViewDisplay-header">
        <a-select style="width: 300px" v-model="selectedDesktopName">
          <a-select-opt-group label="所有桌面">
            <a-select-option :label="ALL_VIEW" :value="ALL_VIEW">{{ ALL_VIEW }}</a-select-option>
          </a-select-opt-group>

          <a-select-opt-group label="用户桌面">
            <a-select-option v-for="(desktop, idx) in userDesktopList" :key="idx" :value="desktop.desktopName">{{
              desktop.desktopName
            }}</a-select-option>
          </a-select-opt-group>

          <a-select-opt-group label="工作组桌面">
            <a-select-option v-for="(desktop, idx) in groupDesktopList" :key="idx" :value="desktop.desktopName">{{
              desktop.desktopName
            }}</a-select-option>
          </a-select-opt-group>
        </a-select>

        <div class="ViewDisplay-control">
          <a-input
            v-show="isThumbnailMode"
            allowClear
            autoFocus
            style="width: 200px"
            placeholder="按视图标题搜索..."
            v-model.trim="queryParams.view_title"
          />
          <a-range-picker
            v-show="!isThumbnailMode"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DDTHH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            v-model="timeRange"
            @change="dateChange"
            @ok="dateSet"
          />
          <div class="ViewDisplay-type">
            <p
              class="ViewDisplay-button"
              :class="[isThumbnailMode && 'ViewDisplay-button--active']"
              @click="toggleThumbnailMode('thumbnail')"
            >
              <a-icon type="appstore" />
              缩略图
            </p>
            <p
              class="ViewDisplay-button"
              :class="[!isThumbnailMode && 'ViewDisplay-button--active']"
              @click="toggleThumbnailMode('tabsPags')"
            >
              <a-icon type="bars" />
              页签
            </p>
          </div>
        </div>
      </div>

      <!-- S 视图缩略图 -->
      <div class="ViewDisplay-content" v-if="isThumbnailMode">
        <a-row :style="{ overflow: 'hidden' }">
          <transition-group name="flip-list" tag="div">
            <a-col
              class="flip-item"
              v-for="viewConfig in allViewList"
              v-show="filterViewIdList.includes(viewConfig.view_id)"
              :key="viewConfig.view_id"
              :id="viewConfig.view_id"
              :xs="24"
              :md="12"
              :lg="8"
              :xxl="6"
            >
              <div class="ViewDisplay-item" @click="preview(viewConfig)">
                <img v-lazy="thumbnail(viewConfig.view_img)" :alt="viewConfig.view_title" />
                <div class="ViewDisplay-item-info">
                  <p class="ViewDisplay-item-info_title">{{ `${viewConfig.view_id}-${viewConfig.view_title}` }}</p>
                  <p class="ViewDisplay-item-info_creator">
                    <span><a-icon type="clock-circle" />{{ (viewConfig.createdate || '').replace('T', ' ') }}</span>
                    <span
                    ><a-icon type="user" />{{
                      viewConfig.user ? viewConfig.user.staff_name : viewConfig.creator
                    }}</span
                    >
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
                  v-show="selectedDesktopName !== ALL_VIEW"
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
      <div class="ViewDisplay-tabs" :class="[isFullScreen && 'fullscreen']" v-else>
        <a-tabs :active-key="activeKey || filterViewList[0].view_id" tab-position="top" @change="tabsChange">
          <div class="PreviewMixin-bar" slot="tabBarExtraContent">
            <a-tooltip placement="top" :title="isAutoPlay ? '暂停' : '播放'">
              <a-icon :type="isAutoPlay ? 'pause-circle' : 'play-circle'" @click="toggleAutoPlay" />
            </a-tooltip>
            <a-tooltip placement="top" title="等宽">
              <a-icon
                type="column-width"
                :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullWidth' }"
                @click="setScaleMode('fullWidth')"
              />
            </a-tooltip>

            <a-tooltip placement="top" title="等高">
              <a-icon
                type="column-height"
                :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullHeight' }"
                @click="setScaleMode('fullHeight')"
              />
            </a-tooltip>

            <a-tooltip placement="top" title="拉伸">
              <a-icon
                type="swap"
                :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullscreen' }"
                @click="setScaleMode('fullscreen')"
              />
            </a-tooltip>

            <a-tooltip placement="top" title="原始">
              <a-icon
                type="pic-center"
                :class="{ 'PreviewMixin-bar--active': scaleMode === 'primary' }"
                @click="setScaleMode('primary')"
              />
            </a-tooltip>

            <a-tooltip placement="top" title="自适应">
              <a-icon
                type="border-outer"
                :class="{ 'PreviewMixin-bar--active': scaleMode === 'auto' }"
                @click="setScaleMode('auto')"
              />
            </a-tooltip>

            <a-tooltip placement="top" :title="isFullScreen ? '退出全屏' : '全屏'">
              <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggleFullscreen" />
            </a-tooltip>
          </div>
          <a-tab-pane
            v-for="viewConfig in filterViewList"
            :key="viewConfig.view_id"
            :tab="viewConfig.view_title"
          >
          </a-tab-pane>
        </a-tabs>
        <a-spin :spinning="isLoadingViewConfig">
          <div class="ViewDisplay-tab-content" :class="[isFullScreen && 'fullscreen']">
            <transition name="renderer">
              <Renderer v-if="view" :view="view" ref="renderer" :timeRange="timeRange" />
            </transition>
          </div>
        </a-spin>
      </div>
      <!-- E 视图页签 -->

      <!-- S 视图预览 -->
      <Preview
        :autoFullScreen="isThumbnailMode"
        :timeRange="timeRange"
        :visible.sync="isVisible"
        :viewList="filterViewList"
        :currentView="targetView"
      />
      <!-- E 视图预览 -->

      <AuthDesktop
        v-if="selectedDesktop"
        :visible.sync="authDesktop.visible"
        :title="selectedDesktopName"
        :selectedKeys="selectedDesktop.viewIds"
        :groupId="selectedDesktop.group_id"
        :userId="selectedDesktop.user_id"
        @success="fetchDesktopConfig"
      />
    </a-spin>
  </div>
</template>

<script>
import AuthDesktop from './modules/AuthDesktop'
import Renderer from '@/components/Renderer'
import DesktopMixin from './DesktopMixin.vue'
import PreviewMixin from './PreviewMixin'
import Preview from '@/components/Preview'
import Vue from 'vue'
import { UserService } from '@/api'
import { decrypt } from '@/utils/aes'
import { SHOW_USER } from '@/store/mutation-types'

export default {
  name: 'ViewDisplay',
  mixins: [DesktopMixin, PreviewMixin],
  components: {
    AuthDesktop,
    Preview,
    Renderer
  },
  data: () => ({
    isVisible: false,
    targetView: null,
    authDesktop: {
      visible: false
    }
  }),
  computed: {},
  methods: {
    editDesktop () {
      this.authDesktop.visible = true
    },
    preview (view) {
      this.isVisible = true
      this.targetView = view
    }
  },
  created () {
    UserService.seondLogin({ userId: 'mZ4ImnGXmqK', pwd: '9ZAauDJ8S2Nd9' })
      .then(({ data }) => data)
      .then(decrypt)
      .then(JSON.parse)
      .then(({ organizeList = [], ...user }) => {
        Vue.ls.set(SHOW_USER, user)
      })
  }
}
</script>

<style lang="less">
.ViewDisplay {
  position: relative;

  &-tab-content {
    width: 100%;
    height: calc(100vh - 230px);
    overflow: auto;
  }

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
    color: rgba(0, 0, 0, 0.67);
    line-height: 32px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.23);
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

  &-spin {
    width: 100%;
    height: calc(100vh - 230px);
  }

  &__operation {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 8px;
  }

  &-item {
    box-sizing: border-box;
    // 固定宽高比
    width: 100%;
    height: 0;
    padding-bottom: calc(100% / 16 * 9 + 63px);
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    box-shadow: 0 0 32px #f0f0f0;
    transform: scale(1);
    transition: transform 0.4s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
      transition: transform 0.4s ease;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 63px;
      display: block;
      width: 100%;
      height: calc(100% - 63px);
      border-radius: 4px;
    }

    &-info {
      position: absolute;
      right: 0;
      bottom: 0px;
      left: 0;
      padding: 7px;
      height: 63px;

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
</style>

<style lang="less" scoped>
@import url('./transition.less');
</style>
