/**
 * 仪表盘静态数据
 */

import _ from 'lodash'

const defaultDegreeRingStaticData = '100'

export default class DegreeRingStaticDataConfig {
  constructor ({
    staticData = defaultDegreeRingStaticData
  }) {
    this.staticData = staticData
  }
  /**
   * 获取柱形图静态数据代码
   * @returns {string}
   */
  getCode (barType) {
    const staticData = _.cloneDeep(this.staticData)
    return JSON.stringify(staticData, null, '\t')
  }
}