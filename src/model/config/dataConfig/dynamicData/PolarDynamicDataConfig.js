/**
* 极坐标数据配置
* Date: 2020/5/20
* Time: 1:40 下午
*/

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  series: [],
  angleAxis: { data: [] }
}

export default class PolarDynamicDataConfig extends DynamicDataConfig {
  async fetch () {
    const dataList = await super.fetch()
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
    return option
  }

  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const {
        angleAxis,
        legend,
        series
      } = await this.fetch()
      Object.assign(this, { angleAxis, legend, series })
    }
    const { angleAxis, legend, series } = this
    return { angleAxis, legend, series }
  }

  async getAlarmOption (loadingDynamicData) {
    if (loadingDynamicData) {
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
            legendData.push(`${origin}-${value.legend}`)
            level1Collection.push(value.level1)
            level2Collection.push(value.level2)
            level3Collection.push(value.level3)
            level4Collection.push(value.level4)
            level5Collection.push(value.level5)
          })
        })
      const option = {
        angleAxis: {
          type: 'category',
          data: legendData
          // data: [
          //   '主机',
          //   '中间件',
          //   '数据库',
          //   '路由器'
          // ]
        },
        legend: {
          // data: Object.keys(groupByOrigin)
          data: [
            '严重告警',
            '重大告警',
            '次要告警',
            '一般告警',
            '最新通知'
          ]
        },
        // series: Object.values(groupByOrigin)[0].map(({ level2 }) => level2)
        series: [
          // { data: [10, 20, 30, 50], stack: '严重告警', name: '严重告警' },
          { data: level1Collection, stack: '严重告警', name: '严重告警' },
          { data: level2Collection, stack: '重大告警', name: '重大告警' },
          { data: level3Collection, stack: '次要告警', name: '次要告警' },
          { data: level4Collection, stack: '一般告警', name: '一般告警' },
          { data: level5Collection, stack: '最新通知', name: '最新通知' }
        ]
      }
      Object.assign(this, option)
    }
    const { angleAxis, legend, series } = this
    return { angleAxis, legend, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
