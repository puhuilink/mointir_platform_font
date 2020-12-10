/**
 * 性能数据接口中间层
 */

import _ from 'lodash'
import moment from 'moment'
import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api'
export class AdaptorResourceConfig extends AdaptorConfig {
  constructor ({
    deviceType = 'Host',
    deviceBrand = 'HostLinux',
    deviceModel = 'HostAIXLinux',
    hostId = [],
    endpointModelId = null,
    metricModelIds = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    ...props
  }) {
    super(props)
    this.deviceType = deviceType
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = _.castArray(hostId)
    this.endpointModelId = endpointModelId
    this.metricModelIds = _.castArray(metricModelIds)
    this.isGroup = isGroup
  }

  fetch () {
    return ViewDataService
      .realData(this.getOption(), this.getTimeoutOption())
      .then(({ data }) => data || [])
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (dataList = []) {
    // 可以查看一台设备的多个 metric 或多台设备的一个 metric
    // 具体以哪种方式组织根据选择项的长度来判断
    const groupByHost = this.hostId.length > 1
    let finalDataList = dataList

    // hack: 端口组
    if (dataList.length && ['Input Rate', 'Output Rate'].includes(dataList[0]['metricAlias'])) {
      const aggregatedDataList = _.groupBy(dataList, el => {
        return el.year ? `${el.year}-${el.month}-${el.day}-${el.metricAlias}` : `${el.collectTime}-${el.metricAlias}`
      })
      finalDataList = Object
        .entries(aggregatedDataList)
        .map(([key, [value, ...restValueList]]) => {
          // 端口组的流量为所有端口流量之和
          value['metricValue'] += _.sum(
            restValueList.map(({ metricValue }) => metricValue)
          )
          // hack: 可能存在精度问题
          value['metricValue'] = Number(value['metricValue'].toFixed(2))
          return value
        })
    }

    return finalDataList
      .map(({
        collectTime = moment().format(),
        endpointAlias = '',
        metricValue = 0,
        metricValueStr = '',
        metricAlias = '',
        hostAlias = '',
        uint = ''
      }) => ({
        data: metricValueStr || metricValue,
        time: this.formatTime(collectTime, this.calculateType ? this.isGroup : null),
        legend: groupByHost ? hostAlias : endpointAlias + metricAlias.replace(endpointAlias, ''),
        name: !groupByHost ? hostAlias : endpointAlias + metricAlias.replace(endpointAlias, ''),
        unit: uint
      }))
      .sort((a, b) => {
        if (moment(a.time).isBefore(b.time)) return -1
        if (moment(a.time).isAfter(b.time)) return 1
        return 0
      })
  }
}
