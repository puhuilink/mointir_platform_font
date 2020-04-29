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
          <span v-if="leftPanelExpand">
            <a-icon type="menu-fold" />
          </span>
          <a-button v-else type="link" icon="appstore">组件库</a-button>
        </div>
        <div class="screen__center">
          <div class="screen__bar">
            <a-button-group>
              <a-tooltip placement="top" title="保存">
                <a-button type="primary" @click="save"><a-icon type="save" /></a-button>
              </a-tooltip>
              <a-tooltip placement="top" title="导出">
                <a-button type="primary" @click="exportFile"><a-icon type="upload" /></a-button>
              </a-tooltip>
              <a-upload
                name="file"
                :before-upload="beforeImport"
                :show-upload-list="false"
                :multiple="false"
              >
                <a-tooltip placement="top" title="导入">
                  <a-button type="primary"><a-icon type="download" /></a-button>
                </a-tooltip>
              </a-upload>
              <a-popconfirm
                title="确定清空画板？"
                @confirm="clear"
                okText="确定"
                cancelText="取消">
                <a-button type="danger" icon="delete">清空</a-button>
              </a-popconfirm>
            </a-button-group>
          </div>

          <a-tooltip placement="top" title="预览">
            <a-button type="primary" @click="preview"><a-icon type="eye" /></a-button>
          </a-tooltip>
        </div>
        <div class="screen__control" @click="panelControl('right')">
          <span v-if="rightPanelExpand">
            <a-icon type="menu-unfold" />
          </span>
          <a-button v-else type="link" icon="setting">配置</a-button>
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

    <ViewPreview :visible.sync="visible" isDesignMode />
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
import { updateViewDesign, getViewDesign } from '@/api/controller/View'
import ViewPreview from '@/views/view/display/modules/viewPreview'

export default {
  name: 'Screen',
  components: {
    Wrapper,
    Widget,
    ViewPreview
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
        this.setView({
          view: new View(Object.assign(
            _.cloneDeep(this.view),
            {
              el: this.$refs.view,
              gauge: this.$refs.gauge,
              parent: this.$refs.page,
              scale: this.scale
            }
          ))
        })

        // 初始化场景进行样式设置
        if (event.type === 'init' && !this.view.config) {
          this.setInitStyle()
        } else {
          // 其他场景中，设置画板样式
          this.setStyle(event)
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
        let activeWidget
        let styles = {}
        switch (el) {
          case 'view':
            activeWidget = this.view
            styles = { display: 'none' }
            break
          case 'widget':
            activeWidget = widget
            // eslint-disable-next-line no-case-declarations
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
            activeWidget = widget
            styles = {
              display: value ? 'block' : 'none'
            }
            break
          default:
            activeWidget = null
            break
        }
        if (el !== 'adjust') {
          // 设置激活的部件
          this.activateWidget({
            widget: activeWidget
          })
          // 设置选择器样式
          this.$refs.wrapper.setSize(styles)
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
        const { event: { mouseType, eventType } } = mutation
        // 当鼠标抬起时更新部件位置状态
        if (mouseType === 'mouseup') {
          const {
            top, left, width, height
          } = window.getComputedStyle(targetComponent.$el, null)
          const widgetPositionState = {
            top: Number(top.split('px')[0]) || 0,
            left: Number(left.split('px')[0]) || 0,
            width: Number(width.split('px')[0]) || 0,
            height: Number(height.split('px')[0]) || 0
          }
          // 更新部件位置信息
          const widget = _.cloneDeep(this.activeWidget)
          Object.assign(widget.config.commonConfig, widgetPositionState)
          this.activateWidget({ widget })
          return
        }
        // 调整部件大小
        this.adjust({
          target: targetComponent.$el,
          mutation
        })
        // 在非移动情况触发时，调整图表尺寸
        if (eventType !== 'MOVE') {
          this.activeWidget.render.resize(config)
        }
      })
  },
  computed: {
    ...mapState('screen', ['view', 'activeWidget', 'topologyEditable']),
    ...mapGetters('screen', ['widgets'])
  },
  methods: {
    ...mapMutations('screen', {
      setView: ScreenMutations.SET_VIEW,
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
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
      this.setView({
        view: Object.assign(new View({
          ...this.view,
          scale: this.scale
        }))
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
        view: Object.assign(new View({
          ...this.view,
          scale: this.scale
        }))
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
     * 保存视图配置
     */
    async save () {
      try {
        this.loading = true
        this.viewOptions = this.view.getOption()
        await updateViewDesign(this.$route.query.id, this.viewOptions)
        this.$notification.success({
          message: '系统提示',
          description: '保存成功'
        })
      } catch (e) {
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
    import (options) {
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
    },
    /**
     * 导出视图配置至json文件
     */
    exportFile () {
      const option = this.view.getOption()
      const title = this.$route.query.title
      downloadFile(`${title}.json`, JSON.stringify(option))
    },
    /**
     * 清空画板
     */
    clear () {
      // 清空部件列表
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
        const options = await getViewDesign(this.$route.query.id)
        this.import(options)
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
      height: 48px;
      background: white;
      box-shadow: 0 2px 8px #f0f1f2;
      z-index: 4;

      p {
        margin: 0;
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
</style>