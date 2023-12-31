/**
* 元素
* Author: dong xing
* Date: 2020/4/8
* Time: 11:24
* Email: dong.xing@outlook.com
*/

import anime from 'animejs'
import store from '@/store'
import { ScreenMutations } from '@/store/modules/screen'
import _ from 'lodash'
import Timeout from 'await-timeout'

export default class Element {
  constructor ({ widget, element, onlyShow }) {
    this.container = document.getElementById(widget.widgetId)
    this.setContainer(widget)
    this.setStyle(widget.config)
    this.config = widget.config
    this.widget = widget
    this.onlyShow = onlyShow
    this.$component = element
    // 初始化配置
    this.mergeOption(widget.config)
  }

  /**
   * 初始设置容器位置尺寸
   * @param config
   */
  setContainer ({ config }) {
    const {
      width, height, top, left, zIndex
    } = config.commonConfig
    anime.set(this.container, {
      width,
      height,
      top,
      left,
      zIndex
    })
  }

  /**
   * 设置基本样式
   * @param config
   */
  setStyle (config) {
    const {
      colorMode, backgroundColor, border
    } = config.commonConfig
    anime.set(this.container, {
      ...border.getOption(),
      background: colorMode === 'single' ? backgroundColor : `linear-gradient(${backgroundColor.angle}deg, ${backgroundColor.start}, ${backgroundColor.end})`
    })
  }

  async mergeOption (config, loadingDynamicData = false) {
    this.$component.elementProps = await this.mappingOption(config, loadingDynamicData)
    if (this.widget && !this.onlyShow && !store.state.screen.isImporting) {
      const { render, ...rest } = this.widget
      const widget = Object.assign({}, _.cloneDeep(rest), { render })
      Object.assign(widget.config, {
        ...config
      })
      store.commit(`screen/${ScreenMutations.ACTIVATE_WIDGET}`, { widget })
    }
  }

  /**
   * 设置专有属性样式，与图表对象使用同一方法m名
   */
  mappingOption (config, loadingDynamicData = false) {}

  refresh () {
    this.mergeOption(this.widget.config, true)
  }

  /**
   * 定时刷新动态数据
   */
  async intervalRefresh () {
    this.refresh()

    const { dataConfig = {} } = this.config
    const refreshTime = dataConfig.getCurrentConfig().refreshTime
    const isAvailable = dataConfig.getCurrentConfig().isAvailable
    const delayTime = dataConfig.getCurrentConfig().delayTime

    if (delayTime) {
      await Timeout.set(delayTime)
    }

    if (refreshTime && isAvailable) {
      this.timer = setInterval(
        this.refresh.bind(this),
        Number(refreshTime) * 1000 * 60
      )
    }
  }

  /**
   * 完整配置设置
   * @param config
   */
  setConfig (config) {
    this.setStyle(config)
    this.mergeOption(config)
  }

  resize () { }

  destroy () {
    const { $component } = this
    $component && $component.$destroy()
    this.$component = null
    clearInterval(this.timer)
    this.timer = null
  }
}
