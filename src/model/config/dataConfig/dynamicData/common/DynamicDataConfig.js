
import { MetricService } from '@/api-hasura'
import { TimeRangeConfig } from './TimeRangeConfig'
import Adaptor from '../Adaptor'
import _ from 'lodash'

export class DynamicDataConfig {
  constructor ({
    resourceConfig = {
      // model: '',
      // selectedInstance: [],
      // selectedKpi: [],
      // detailInstance: [],
      // new cmdb
      cmdbHostIdList: [],
      modelEndpointId: null,
      modelMetricIdList: [],
      modelHostId: null
    },
    // 横轴类型
    xAxisType = 'RESOURCE',
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRangeConfig = {}
  }) {
    // this.resourceConfig = resourceConfig
    this.resourceConfig = {
      cmdbHostIdList: [257882722304],
      modelEndpointId: 1988235274,
      modelMetricIdList: [1988235275],
      modelHostId: 1988235264
    }
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRangeConfig } = this
    return MetricService
      .chartValue({
        resourceConfig,
        timeRange: timeRangeConfig.getOption(),
        orderBy: { collect_time: 'desc' },
        ...argus
      })
      .then(Adaptor.transfer)
      .catch(err => {
        console.error(err)
        return []
      })
  }

  getOption () { }

  groupByInstance (data) {
    return _.groupBy(data, 'instance_id')
  }

  groupByCi (data) {
    return _.groupBy(data, 'instanceLabel')
  }

  groupByKpi (data) {
    return _.groupBy(data, 'kpiLabel')
  }

  groupByArisingTime (data) {
    return _.groupBy(data, 'arising_time')
  }

  resetData () {}
}
