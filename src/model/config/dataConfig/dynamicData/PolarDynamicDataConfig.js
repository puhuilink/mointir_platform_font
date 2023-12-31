/**
* 极坐标动态数据配置
*/

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM
} from './types/sourceType'

const initialOption = {
  legend: {},
  series: [],
  angleAxis: { data: [] }
}

export default class PolarDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    if (loadingDynamicData) {
      switch (sourceType) {
        case SOURCE_TYPE_REAL: {
          await this.getRealDataOption()
          break
        }
        case SOURCE_TYPE_ALARM: {
          await this.getAlarmOption()
          break
        }
      }
    }
    const { angleAxis, legend, series } = this
    return { angleAxis, legend, series }
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const legendList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const categoryList = Object.keys(groupByName)
    const option = {
      legend: {
        data: categoryList
      },
      angleAxis: {
        type: 'category',
        data: legendList
      },
      series: categoryList.map(name => ({
        name: name,
        data: groupByName[name].map(({ data }) => data)
      }))
    }
    Object.assign(this, option)
  }

  async getAlarmOption () {
    const dataList = await this.alarmConfig.fetch()
    const groupByOrigin = _.groupBy(dataList, 'name')
    const legendData = []
    const level1Collection = []
    const level2Collection = []
    const level3Collection = []
    const level4Collection = []
    const level5Collection = []
    Object
      .entries(groupByOrigin)
      .forEach(([origin, values]) => {
        values.forEach((value) => {
          // FIXME: 在数据域设计开发完成前，硬编码处理北京数据中心与厦门数据中心数据
          origin = origin
            .replace('BJ1', '北京数据中心')
            .replace('BJ2', '北京数据中心')
            .replace('XM1', '厦门数据中心')
            .replace('XM2', '厦门数据中心')

          // 如BJ1-网络设备与BJ2网络设备，统一归类为北京数据中心-网络设备
          const v = `${origin}-${value.legend}`
          const index = legendData.indexOf(v)
          if (index === -1) {
            legendData.push(v)
            level1Collection.push(value.level1)
            level2Collection.push(value.level2)
            level3Collection.push(value.level3)
            level4Collection.push(value.level4)
            level5Collection.push(value.level5)
          } else {
            level1Collection[index] += value.level1
            level2Collection[index] += value.level2
            level3Collection[index] += value.level3
            level4Collection[index] += value.level4
            level5Collection[index] += value.level5
          }
        })
      })

    const option = {
      angleAxis: {
        type: 'category',
        data: legendData
      },
      legend: {
        data: [ '紧急告警', '主要告警', '次要告警', '一般告警', '最新通知' ]
      },
      series: [
        { data: level1Collection, stack: '紧急告警', name: '紧急告警' },
        { data: level2Collection, stack: '主要告警', name: '主要告警' },
        { data: level3Collection, stack: '次要告警', name: '次要告警' },
        { data: level4Collection, stack: '一般告警', name: '一般告警' }
        // 暂不展示5级告警
        // { data: level5Collection, stack: '最新通知', name: '最新通知' }
      ]
    }
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
