/**
 * 折线图
 * Author: dong xing
 * Date: 2019/11/20
 * Time: 8:55 上午
 * Email: dong.xing@outlook.com
 */

import Chart from './index'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC,
  SOURCE_TYPE_OVERVIEW
} from '../config/dataConfig/dynamicData/types/sourceType'
import { autoTooltipPosition } from '@/utils/echarts'

export default class LineChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   * @param commonConfig 公共配置
   * @param proprietaryConfig 专有配置
   * @param dataConfig 数据配置
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @return {Promise<any>}
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const { legend, xAxis, yAxis, itemStyle: { color }, ...options } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData }, dbDataConfig } = dataConfig
    const line = (index) => ({
      type: 'line',
      itemStyle: {
        color: Array.isArray(color) ? color[index] : color
      },
      ...options
    })
    let series = []

    // 总体配置
    const option = { grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        dbDataConfig.resetData()
        series = staticData.series.map((item, index) => ({ ...item, ...line(index) }))
        const { legend: staticLegend, xAxis: staticXAxis, yAxis: staticYAxis } = staticData
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          xAxis: Object.assign(xAxis, staticXAxis),
          yAxis: Object.assign(yAxis, staticYAxis),
          series
        })
        break
      }
      case SOURCE_TYPE_NULL: {
        dbDataConfig.resetData()
        break
      }
      case SOURCE_TYPE_REAL:
      case SOURCE_TYPE_OVERVIEW: {
        const dynamicData = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        series = dynamicData.series.map((item, index) => ({ ...item, ...line(index) }))
        const { legend: dynamicLegend, xAxis: dynamicXAxis, yAxis: dynamicYAxis } = dynamicData
        Object.assign(option, {
          legend: Object.assign(legend, dynamicLegend),
          xAxis: Object.assign(xAxis, dynamicXAxis),
          yAxis: Object.assign(yAxis, dynamicYAxis),
          series
        })
        break
      }
    }

    return Object.assign({}, option, {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        position: autoTooltipPosition
      }
    })
  }
}
