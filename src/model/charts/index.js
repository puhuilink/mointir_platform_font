/**
 * echarts 图表对象
 * Author: dong xing
 * Date: 2019/11/25
 * Time: 4:55 下午
 * Email: dong.xing@outlook.com
 */
import anime from 'animejs'
import echarts from 'echarts'
import _ from 'lodash'
import Timeout from 'await-timeout'

export default class Chart {
  constructor ({ widget, onlyShow }) {
    this.container = document.getElementById(widget.widgetId)
    this.chartConfig = {}
    this.setContainer(widget)
    this.init(widget, onlyShow)
    this.setStyle(widget.config)
    this.config = widget.config
    this.onlyShow = onlyShow
  }

  /**
   * 初始设置图表位置尺寸
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
      background: colorMode === 'single'
        ? backgroundColor
        : `linear-gradient(${backgroundColor.angle}deg, ${backgroundColor.start}, ${backgroundColor.end})`
    })
    // 在矩形等图形中，设置resize调用矩形类的resize方法，需要传入config配置
    this.resize(config)
  }

  /**
   * 初始化图表
   * @param widget
   */
  init ({ config }) {
    this.chart = echarts.init(this.container, '', {
      renderer: 'canvas'
    })
    this.mergeOption(config)
  }

  /**
   * 图表resize
   */
  resize () {
    this.chart.resize()
  }

  /**
   * 重置图表默认配置
   */
  reset () {
    this.chart.setOption({})
  }

  /**
   * 完整配置设置
   * @param config
   */
  setConfig (config) {
    this.setStyle(config)
    this.mergeOption(config)
  }

  /**
   * 映射成 echarts 配置项
   */
  // eslint-disable-next-line class-methods-use-this
  mappingOption () {}

  /**
   * 设置新的配置项渲染图表
   * @param config widget 配置项
   * @param {Boolean} loadingDynamicData 是否同时绘制动态数据
   */
  async mergeOption (config, loadingDynamicData = false) {
    this.chart.clear()
    // 向外暴露 echarts 配置
    this.chartConfig = await this.mappingOption(config, loadingDynamicData)
    // 如果数据为空则清空图表
    if (_.isEmpty(this.chartConfig.series)) {
      this.chart.clear()
    }
    // 重新配置图表
    // https://github.com/apache/incubator-echarts/issues/3976
    this.chart.setOption(this.chartConfig)
  }

  refresh () {
    this.mergeOption(this.config, true)
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

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }

  resetTimer () {
    clearInterval(this.timer)
    this.timer = null
  }

  /**
   * 销毁事件
   */
  destroy () {
    this.resetTimer()
    this.chart.dispose()
  }
}
