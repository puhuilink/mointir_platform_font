/**
* 部件对象
* Author: dong xing
* Date: 2019/11/13
* Time: 2:01 下午
* Email: dong.xing@outlook.com
*/

import uuid from 'uuid/v4'
import Config from '../config'

export default class Widget {
  constructor ({
    widgetId = 'widget-' + uuid(),
    config = {},
    render = null
  }) {
    this.widgetId = widgetId
    this.config = new Config(config)
    this.render = render
  }

  /**
   * 获取部件配置
   * @returns {*}
   */
  getOption () {
    const { widgetId, config } = this
    return {
      widgetId,
      config: config.getOption()
    }
  }

  /**
   * 获取部件配置副本
   * @returns {*}
   */
  getEctypalOption () {
    const { widgetId, config } = this
    return {
      widgetId: `${widgetId}-ectypal`,
      config: config.getOption()
    }
  }
}
