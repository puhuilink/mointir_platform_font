/**
* 视图对象
* Author: dong xing
* Date: 2020/3/10
* Time: 18:11
* Email: dong.xing@outlook.com
*/

// import _ from 'lodash'
import uuid from 'uuid/v4'
import Config from '../config'
import { Range } from '../common'

// 默认配置
const defaultConfig = {
  commonConfig: {
    width: 1920,
    height: 1080
  }
}

/**
 * el 当前dom元素
 * gauge 视图标尺dom元素
 * parent 当前dom元素父级元素
 */
export default class View {
  constructor ({
    el,
    gauge,
    parent,
    id = 'view-' + uuid(),
    name = '',
    views = [],
    widgets = [],
    scale = 1,
    cover = '',
    config = defaultConfig
  }) {
    this.id = id
    this.el = el
    this.gauge = gauge
    this.parent = parent
    this.rect = el.getBoundingClientRect()
    this.name = name
    this.views = views
    this.widgets = widgets
    this.scale = scale
    this.cover = cover
    this.config = new Config(Object.assign(config, {
      type: 'View'
    }))
    // 视图有效区域
    this.area = {
      xRange: new Range(this.rect.x, this.rect.x + this.config.commonConfig.width * this.scale),
      yRange: new Range(this.rect.y, this.rect.y + this.config.commonConfig.height * this.scale)
    }
  }

  /**
   * 获取视图配置
   * @returns {{widgets: *[], config: Config}}
   */
  getOption () {
    const { id, name, config, views, widgets } = this
    return {
      id,
      name,
      config,
      views,
      widgets: widgets.map(widget => widget.getOption())
    }
  }

  /**
   * 获取视图配置副本
   * @returns {{widgets: *[], config: Config}}
   */
  getEctypalOption () {
    const { id, name, config, views, widgets } = this
    return {
      id: `${id}-ectypal`,
      name,
      config,
      views,
      widgets: widgets.map(widget => widget.getEctypalOption())
    }
  }
}
