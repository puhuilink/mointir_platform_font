/**
* 视图及操作
* Author: dong xing
* Date: 2019/11/13
* Time: 1:44 下午
* Email: dong.xing@outlook.com
*/
<template>
  <a-spin :spinning="loading">
    <div class="screen">
      <div class="screen__header">
        <div class="screen__control" @click="panelControl('left')">
          <a-button type="link" :icon="leftPanelExpand ? 'menu-fold' : 'menu-unfold'"></a-button>
        </div>
        <div class="screen__center">
          <div class="screen__bar">

            <div class="screen__front">
              <a-button-group>
                <a-popconfirm
                  title="确定删除选中部件"
                  :disabled="!isWidgetEditable"
                  @confirm="deleteWidgets"
                  okText="提交"
                  cancelText="取消">

                  <a-tooltip>
                    <template slot="title">
                      删除
                    </template>
                    <a-button
                      type="link"
                      :disabled="!isWidgetEditable"
                      :class="{
                        'screen__danger': isWidgetEditable
                      }"
                      icon="delete"/>
                  </a-tooltip>
                </a-popconfirm>

                <transition-group name="transition-fade" mode="out-in">
                  <a-tooltip
                    v-for="[direction, label] in [
                      ['arrow-up', '向上对齐'],
                      ['arrow-left', '向左对齐'],
                      ['arrow-down', '向下对齐'],
                      ['arrow-right', '向右对齐'],
                      ['arrows-alt', '等宽高'],
                      ['column-width', '等宽'],
                      ['column-height', '等高']
                    ]"
                    :key="direction"
                    :title="label"
                    v-show="multipleWidgetsEditable"
                  >
                    <a-button
                      type="link"
                      :icon="direction"
                      @click="alignMultipleWidgets(direction)" />
                  </a-tooltip>

                  <!-- TODO -->
                  <!-- <a-tooltip key="copy" title="复制部件" v-show="isWidgetEditable && !multipleWidgetsEditable" >
                    <a-button type="link" icon="copy" @click="copyWidget" />
                  </a-tooltip>
                  <a-tooltip key="snippets" title="复制配置" v-show="isWidgetEditable && !multipleWidgetsEditable" >
                    <a-button type="link" icon="snippets" @click="copyConfig" />
                  </a-tooltip>
                  <a-menu key="sync" mode="horizontal" v-show="isWidgetEditable && !multipleWidgetsEditable" :style="{ display: 'inline-block' }">
                    <a-tooltip title="同步配置" slot="title">
                      <a-button type="link" icon="sync" />
                    </a-tooltip>
                    <a-sub-menu>
                      <a-menu-item key="all" @click="syncConfig(['commonConfig', 'proprietaryConfig', 'dataConfig'])">全部配置</a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="commonConfig" @click="syncConfig(['commonConfig'])">样式</a-menu-item>
                      <a-menu-item key="proprietaryConfig" @click="syncConfig(['proprietaryConfig'])">属性</a-menu-item>
                      <a-menu-item key="dataConfig" @click="syncConfig(['dataConfig'])">数据</a-menu-item>
                    </a-sub-menu>
                  </a-menu> -->
                </transition-group>

              </a-button-group>

            </div>

            <div class="screen__end">
              <a-button-group>
                <a-tooltip placement="top" title="提交">
                  <a-button type="link" @click="save"><a-icon type="save" /></a-button>
                </a-tooltip>
                <a-tooltip placement="top" title="导出">
                  <a-button type="link" @click="exportFile"><a-icon type="upload" /></a-button>
                </a-tooltip>
                <a-upload
                  name="file"
                  :before-upload="beforeImport"
                  :show-upload-list="false"
                  :multiple="false"
                >
                  <a-tooltip placement="top" title="导入">
                    <a-button type="link"><a-icon type="download" /></a-button>
                  </a-tooltip>
                </a-upload>
                <a-popconfirm
                  title="确定清空画板？"
                  @confirm="clear"
                  okText="提交"
                  cancelText="取消">

                  <a-tooltip>
                    <template slot="title">
                      清空
                    </template>
                    <a-button type="link" class="screen__danger" icon="close-square" />
                  </a-tooltip>

                </a-popconfirm>
                <a-tooltip placement="top" title="预览">
                  <a-button type="link" @click="preview"><a-icon type="eye" /></a-button>
                </a-tooltip>
              </a-button-group>

            </div>

          </div>

        </div>
        <div class="screen__control" @click="panelControl('right')">
          <a-button type="link" :icon="rightPanelExpand ? 'menu-unfold' : 'menu-fold'"></a-button>
        </div>
      </div>

      <!-- S 画板 -->
      <div
        ref="page"
        class="page"
        @click.self="() => select$.next({ el: 'view' })">

        <div class="gauge" ref="gauge"></div>
        <!-- / 标尺 -->

        <div ref="view" class="view">

          <Widget
            v-for="widget in widgets"
            :widget="widget"
            :key="widget.widgetId"
            :ref="widget.widgetId"
            @select="(selectWidget) => select$.next({ el: 'widget', widget: selectWidget })"
          />
          <!-- / 部件渲染 -->

          <Wrapper ref="wrapper" v-stream:adjust="adjust$" />
        <!-- / 选择指示器 -->

        </div>
      <!-- / 视图 -->

      </div>
      <!-- E 画板 -->

      <!-- S 比例条 -->
      <div class="scale-bar">
        <a-tooltip placement="top">
          <template slot="title">
            自动比例：{{ isAutoResize ? '已开启' : '已关闭' }}
          </template>
          <a-switch
            size="small"
            v-model="isAutoResize"
            @change="() => isAutoResize && change$.next({ type: 'resize' })" />
        </a-tooltip>
        <a-slider
          class="scale-bar__slider"
          @change="() => change$.next({ type: 'scale', value: scale })"
          :disabled="isAutoResize"
          :min="0"
          :max="1"
          :step="0.01"
          v-model="scale" />
        <p class="scale-bar__number">缩放比：{{ this.scale.toFixed(2) }}</p>
      </div>
      <!-- E 比例条 -->
    </div>

    <Preview autoFullScreen :visible.sync="visible" isDesignMode />
  </a-spin>
</template>

<script>
import {
  fromEvent, merge, Subject, zip
} from 'rxjs'
import {
  startWith, mapTo, takeWhile,
  pluck, map, filter
} from 'rxjs/operators'
import { mapState, mapGetters, mapMutations } from 'vuex'
import anime from 'animejs'
import _ from 'lodash'
import PerfectScrollbar from 'perfect-scrollbar'
import { downloadFile } from '@/utils/util'
import { ScreenMutations } from '@/store/modules/screen'
import View from '@/model/view'
import WidgetModel from '@/model/widget'
import ViewService from '../config/view'
import Wrapper from '@/components/Wrapper/index'
import Widget from '@/components/Widget/index'
import AdjustMixins from '@/components/Wrapper/AdjustMixins.vue'
import WrapperService from '@/components/Wrapper/WrapperService'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import Preview from '@/components/Preview'
import { ViewDesignService } from '@/api'

export default {
  name: 'Screen',
  components: {
    Wrapper,
    Widget,
    Preview
  },
  mixins: [AdjustMixins],
  // 选择器调整事件流
  domStreams: ['adjust$'],
  subscriptions () {
    // 画板change事件流
    this.change$ = new Subject()
    // 画板上元素触发事件流
    this.select$ = new Subject()
    return {
    }
  },
  data: () => ({
    width: 1920,
    height: 1080,
    leftPanelExpand: true,
    rightPanelExpand: true,
    backgroundColor: 'rgba(255,255,255,1)',
    scale: 1,
    loading: false,
    isAutoResize: true,
    isShiftKeyDown: false,
    isSubscribed: true,
    isResize: false,
    wrapperChange$: new WrapperService().change$,
    viewChange$: new ViewService().change$,
    // 滚动条
    perfectScrollBar: null,
    // 视图配置
    viewOptions: null,
    // 视图预览页面是否可见
    visible: false
  }),
  mounted () {
    const { platform } = navigator
    // 如果是 windows 平台，美化滚动条
    if (platform === 'Win32' || platform === 'Windows') {
      // 设置滚动条
      this.perfectScrollBar = new PerfectScrollbar(this.$refs.page, {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20
      })
    }

    // shift键盘事件处理
    merge(
      fromEvent(document, 'keydown'),
      fromEvent(document, 'keyup')
    )
      .pipe(
        takeWhile(() => this.isSubscribed),
        filter(({ key }) => key === 'Shift'),
        map(({ type }) => type === 'keydown')
      )
      .subscribe(isShiftKeyDown => {
        this.isShiftKeyDown = isShiftKeyDown
      })

    // 视图change事件处理
    merge(
      fromEvent(window, 'resize').pipe(mapTo({ type: 'resize' })),
      this.change$,
      this.viewChange$
    )
      .pipe(
        takeWhile(() => this.isSubscribed),
        startWith({ type: 'init' })
      )
      .subscribe((event) => {
        // 更新滚动条
        this.perfectScrollBar && this.perfectScrollBar.update()

        // 设置屏幕对象
        if (event.type === 'init') {
          // 初次进入时this.view还未实例化
          this.setView({
            view: new View(Object.assign(
              {},
              this.view,
              {
                el: this.$refs.view,
                gauge: this.$refs.gauge,
                parent: this.$refs.page,
                scale: this.scale
              }
            ))
          })
        } else {
          // 更新this.view的部分配置但不需要重新实例化
          this.setView({
            view: Object.assign(Object.create(View.prototype), {
              ...this.view,
              el: this.$refs.view,
              gauge: this.$refs.gauge,
              parent: this.$refs.page,
              scale: this.scale
            })
          })
        }

        // 初始化配置
        if (event.type === 'init' || !this.view.config) {
          this.setInitStyle()
          this.activateWidget({ widget: this.view })
        } else {
          // 更新画板样式
          this.setStyle(event)
          this.setView({ view: this.view })
        }
      })

    // 选择激活的部件
    merge(
      this.select$,
      // 作为子元素的选择器事件取消冒泡，只有 mousedown 和 mouseup 时间逐次在 view 视图上触发时，才响应为一次事件
      zip(
        fromEvent(this.$refs.view, 'mousedown', { capture: false }),
        fromEvent(this.$refs.view, 'mouseup', { capture: false })
      ).pipe(
        map(events => ({ el: 'view', events })),
        filter(({ events: [mousedownEvent] }) => [...mousedownEvent.target.classList].includes('view'))
      ),
      this.wrapperChange$
    )
      .pipe(
        takeWhile(() => this.isSubscribed),
        // 当拓扑视图在编辑时禁用其他部件的激活功能
        filter(({ el }) => !this.topologyEditable || el === 'topology')
      )
      .subscribe(({ el, widget, value }) => {
        let targetWidget
        let styles = {}
        switch (el) {
          case 'widget':
            targetWidget = widget
            const {
              config: {
                commonConfig: { width, height, top, left }
              }
            } = widget
            styles = {
              display: 'block',
              width,
              height,
              top,
              left
            }
            break
          case 'topology':
            // 拓扑视图尺寸开关开闭时触发
            targetWidget = widget
            styles = {
              display: value ? 'block' : 'none'
            }
            break
          case 'view':
          default:
            targetWidget = this.view
            styles = { display: 'none' }
            break
        }

        if (el === 'adjust') return

        if (this.isShiftKeyDown) {
          this.activateMultipleWidgets({
            widget: targetWidget,
            styles
          })
        } else {
          this.activateSingleWidget({
            widget: targetWidget,
            styles
          })
        }
      })

    // 部件尺寸调整
    this.adjust$
      .pipe(
        takeWhile(() => this.isSubscribed),
        pluck('event', 'msg')
      )
      .subscribe((mutation) => {
        const { widgetId, config } = this.activeWidget
        const [targetComponent] = this.$refs[widgetId]
        const { event: { mouseType, eventType, position = {} } } = mutation
        // 当鼠标抬起时更新部件位置状态
        if (mouseType === 'mouseup') {
          const {
            top, left, width, height
          } = window.getComputedStyle(targetComponent.$el, null)
          const widgetPositionState = {
            top: _.get(position, ['closestTop'], Number(top.split('px')[0]) || 0),
            left: _.get(position, ['closestLeft'], Number(left.split('px')[0]) || 0),
            width: Number(width.split('px')[0]) || 0,
            height: Number(height.split('px')[0]) || 0
          }
          // 更新部件位置信息
          Object.assign(this.activeWidget.config.commonConfig, widgetPositionState)
          this.activateWidget({
            widget: this.activeWidget
          })
        }
        // 调整部件大小
        this.adjust({
          target: targetComponent.$el,
          mutation
        })
        // 在非移动情况触发时，调整图表尺寸
        if (eventType !== 'MOVE') {
          this.resizeWidget(config)
        }
      })
  },
  computed: {
    ...mapState('screen', ['view', 'activeWidget', 'subActiveWidgets', 'topologyEditable']),
    ...mapGetters('screen', ['widgets']),
    isWidgetEditable () {
      return this.activeWidget && this.activeWidget.config.type !== 'View'
    },
    multipleWidgetsEditable () {
      return !!(this.isWidgetEditable && this.subActiveWidgets.length)
    }
  },
  methods: {
    ...mapMutations('screen', {
      setView: ScreenMutations.SET_VIEW,
      resetTopologyState: ScreenMutations.RESET_TOPOLOGY_STATE,
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      activateSubWidgets: ScreenMutations.ACTIVATE_SUB_WIDGETS,
      removeWidgets: ScreenMutations.REMOVE_WIDGETS,
      setImportingState: ScreenMutations.SET_IMPORTING_STATE
    }),
    resizeWidget: _.throttle(function (config) {
      this.activeWidget.render.resize(config)
    }, 10),
    /**
     * 左右panel展开与否
     * @param type 左右panel
     */
    panelControl (type) {
      const mapping = new Map([
        ['left', 'leftPanelExpand'],
        ['right', 'rightPanelExpand']
      ])
      this[mapping.get(type)] = !this[mapping.get(type)]
      this.$emit(type, this[mapping.get(type)])
      setTimeout(() => {
        this.change$.next({ type: 'resize' })
      }, 400)
    },
    /**
     * 初始化设置样式
     */
    setInitStyle () {
      const { width, height } = this.$refs.page.getBoundingClientRect()
      const xScale = ((width - 32) / this.width)
      const yScale = ((height - 32) / this.height)
      this.scale = Math.min(xScale, yScale)
      anime({
        targets: this.$refs.view,
        scale: this.scale,
        duration: 150,
        easing: 'linear'
      })

      anime({
        targets: this.$refs.gauge,
        width: this.width * this.scale + 32,
        height: this.height * this.scale + 32,
        duration: 150,
        easing: 'linear'
      })

      // 更新视图缩放
      // 更新this.view的部分配置但不需要重新实例化
      this.setView({
        view: Object.assign(Object.create(View.prototype), {
          ...this.view,
          scale: this.scale
        })
      })
    },
    /**
     * 设置视图缩放及尺寸
     * @param event
     */
    setStyle (event) {
      const {
        width: pageWidth,
        height: pageHeight
      } = this.$refs.page.getBoundingClientRect()
      const {
        config: {
          commonConfig: {
            width, height
          },
          proprietaryConfig: {
            mode,
            backgroundColor,
            backgroundImage,
            backgroundRepeat,
            backgroundSize
          }
        }
      } = this.view
      const xScale = ((pageWidth - 32) / width)
      const yScale = ((pageHeight - 32) / height)

      // 如果手动调整缩放条，则直接设置缩放比例
      if (event.type === 'scale') {
        this.scale = event.value
      } else {
        // 如果开启自动调整则设置缩放
        if (this.isAutoResize) {
          // 根据宽高最小的比例设置缩放，其余更改只更新该类型变量数据
          this.scale = Math.min(xScale, yScale)
        }
      }

      // 更新视图缩放
      this.setView({
        view: Object.assign(Object.create(View.prototype), {
          ...this.view,
          scale: this.scale
        })
      })

      anime.set(this.$refs.view, {
        backgroundImage: mode === 'image' ? `url(${backgroundImage})` : '',
        backgroundRepeat,
        backgroundSize
      })

      anime({
        targets: this.$refs.view,
        width,
        height,
        scale: this.scale,
        background: mode === 'single' ? backgroundColor : `linear-gradient(${backgroundColor.angle}deg, ${backgroundColor.start}, ${backgroundColor.end})`,
        duration: 150,
        easing: 'linear'
      })

      anime({
        targets: this.$refs.gauge,
        width: width * this.scale + 32,
        height: height * this.scale + 32,
        duration: 150,
        easing: 'linear'
      })
    },
    /**
     * 提交视图配置
     */
    async save () {
      try {
        this.loading = true
        this.viewOptions = this.view.getOption()
        await ViewDesignService.updateViewDesign(this.$route.query.id, this.viewOptions)
        this.$notification.success({
          message: '系统提示',
          description: '提交成功',
          duration: 2
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '提交失败',
          duration: 2
        })
        throw e
      } finally {
        this.loading = false
      }
    },
    /**
     * 导入视图配置前置操作
     * @param file
     * @returns {boolean}
     */
    beforeImport (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.import(
          JSON.parse(reader.result)
        )
      }
      reader.readAsText(file)
      return false
    },
    /**
     * 导入视图配置
     */
    async import (options) {
      this.setImportingState({ isImporting: true })
      this.viewOptions = _.omit(options, ['id', 'name'])
      // 实例化部件对象
      const widgets = this.viewOptions.widgets.map(config => new WidgetModel(config))
      // 更新视图对象
      this.setView({
        view: new View({
          ...this.view,
          ...this.viewOptions,
          ...{ widgets }
        })
      })
      // 设置视图样式
      this.setStyle({ type: 'input' })
      // 设置激活元素为当前画板
      this.activateWidget({ widget: this.view })
      // 等待视图及 widgets 初始化
      await this.$nextTick()
      this.setImportingState({ isImporting: false })
    },
    /**
     * 导出视图配置至json文件
     */
    exportFile () {
      try {
        const option = this.view.getOption()
        const title = this.$route.query.title
        downloadFile(`${title}.json`, JSON.stringify(option))
        this.$notification.success({
          message: '系统提示',
          description: '导出成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '导出失败'
        })
        throw e
      }
    },
    /**
     * 清空画板
     */
    clear () {
      this.resetTopologyState()
      // 重新实例化回到默认设置
      this.setView({
        view: new View({ ..._.pick(this.view, ['id', 'el', 'gauge', 'parent']) })
      })
      // 设置当前激活为当前画板
      this.activateWidget({ widget: this.view })
      // 初始化样式
      this.setStyle({ type: 'reset' })
      // 移除部件选择器
      anime.set('#wrapper', { display: 'none' })
    },
    /**
     * 预览视图
     */
    preview () {
      this.visible = true
    },
    /**
     * 初始化数据
     * @returns {Promise<any>}
     */
    async init () {
      try {
        this.loading = true
        const options = await ViewDesignService.getDesign({
          view_id: this.$route.query.id,
          useCache: false
        })
        this.import(options)
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    /**
     * 复制部件
     */
    copyWidget () {
      this.$refs.wrapper.copyWidget()
    },
    /**
     * 复制配置
     */
    copyConfig () {
      this.$refs.wrapper.copyConfig()
    },
    /**
     * 同步配置
     * @param {Array} configTypes 要合并的配置名
     */
    syncConfig (configTypes) {
      this.$refs.wrapper.syncConfig(configTypes)
    },
    /**
     * 删除部件
     */
    deleteWidgets () {
      const widgets = this.subActiveWidgets.slice()
      if (this.isWidgetEditable) {
        widgets.push(this.activeWidget)
      }
      this.removeWidgets({
        widgetIds: widgets.map(({ widgetId }) => widgetId)
      })
    },
    /**
     * 选中单个部件
     * @param {{ widget, styles }}
     */
    activateSingleWidget ({ widget, styles }) {
      // 设置激活的部件
      this.activateWidget({ widget })
      // 设置选择器样式
      this.$refs.wrapper.setSize(styles)
    },
    /**
     * 批量选中部件
     * @param {{ widget, styles }} widget shift按下时鼠标选中的部件
     */
    activateMultipleWidgets ({ widget, styles }) {
      // 无主激活部件设置为主激活部件
      if (!this.activeWidget || this.activeWidget.config.type === 'View') {
        this.activateSingleWidget({ widget, styles })
        return
      }

      // 已作为主激活部件不操作
      if (this.activeWidget.widgetId === widget.widgetId) return

      const subActiveWidgets = this.subActiveWidgets.slice()
      const index = subActiveWidgets.findIndex(({ widgetId }) => widgetId === widget.widgetId)

      if (index !== -1) {
        // 取消批量选中
        subActiveWidgets.splice(index, 1)
      } else {
        // 批量选中
        subActiveWidgets.push(widget)
      }
      this.activateSubWidgets({ widgets: subActiveWidgets })
    },
    /**
     * 批量对齐
     */
    alignMultipleWidgets (direction = 'left') {
      const {
        commonConfig: { width, height, top, left }
      } = this.activeWidget.config

      this.activateSubWidgets({
        widgets: this.subActiveWidgets.map(widget => {
          const {
            commonConfig: { width: widgetWidth, height: widgetHeight }
          } = widget.config

          let layoutConfig = {}
          switch (direction) {
            case 'arrow-up':
              layoutConfig = { top }
              break
            case 'arrow-left':
              layoutConfig = { left }
              break
            case 'arrow-down':
              layoutConfig = { top: top + height - widgetHeight }
              break
            case 'arrow-right':
              layoutConfig = { left: left + width - widgetWidth }
              break
            case 'arrows-alt':
              layoutConfig = { width, height }
              break
            case 'column-width':
              layoutConfig = { width }
              break
            case 'column-height':
              layoutConfig = { height }
              break
            default:
              break
          }

          Object.assign(widget.config.commonConfig, layoutConfig)
          anime.set(
            document.getElementById(widget.widgetId),
            layoutConfig
          )
          widget.render && widget.render.resize(widget.config)

          return widget
        })
      })
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    this.isSubscribed = false
    // 销毁滚动条
    this.perfectScrollBar && this.perfectScrollBar.destroy()
    // 清空画布
    this.clear()
  }
}
</script>

<style scoped lang="less">
  .screen {
    height: calc(100vh - 54px);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: stretch;
    background: whitesmoke;

    &__header {
      position: relative;
      flex: none;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      height: 42px;
      background: white;
      box-shadow: 0 2px 8px #f0f1f2;
      z-index: 4;

      p {
        margin: 0;
      }
    }

    &__bar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .ant-btn {
        padding: 1px 6px;
      }
    }

    &__danger {
      color: #ff4d4f;

      &:hover {
        color: #ff4d4f;
      }
    }

    &__control {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      height: 100%;

      & span {
        flex: none;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 48px;
        height: 100%;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    &__center {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 16px;
    }

    &__size {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;

      .ant-input-group-wrapper {
        width: 120px;
        margin-left: 16px;
      }
    }

    &__spin {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .page {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    overflow: auto;
    background: #f1f1f1;
  }

  .gauge {
    position: absolute;
    top: 0;
    left: 0;
  }

  .scale-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    padding: 0 16px;
    height: 48px;
    background: white;
    border: 2px solid whitesmoke;
    border-bottom: none;
    z-index: 3;

    &__slider.ant-slider {
      width: 200px;
      margin: 0 16px;
    }

    &__number {
      width: 85px;
      margin: 0;
    }
  }

  .view {
    position: relative;
    height: 1080px;
    width: 1920px;
    margin: 16px 0 0 16px;
    background: white;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),
    0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    transform-origin: 0 0;
    overflow: hidden;
  }

  .transition-fade {

    &-enter-active,
    &-leave-active {
      transition: opacity .3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    }

    &-enter,
    &-leave-to
    {
      opacity: 0;
      transition: opacity .3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    }

  }
</style>
