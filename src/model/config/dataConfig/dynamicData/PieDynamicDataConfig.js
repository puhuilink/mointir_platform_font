/**
 * 饼图动态数据配置
 */

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  series: []
}

export default class PieDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const data = await this.fetch()
        const seriesData = data.map(item => ({
          name: `${item.instanceLabel}-${item.kpiLabel}-${item.instance_id}`,
          value: item.value
        }))
        this.legend = {
          data: seriesData.map(item => item.name)
        }
        this.series = [{
          data: seriesData
        }]
      } catch (e) {
        this.resetData()
        throw e
      }
    }
    const { legend, series } = this
    return _.cloneDeep({ legend, series })
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
