/**
 * 告警数据接口适配层
 */

import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api'
import { ALARM_TYPE_ALL } from '../types/alarmType'
import { compare } from '@/utils/moment'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    // 数据域
    origin = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    // 监控类型
    deviceType = [],
    // 告警等级
    level = [],
    hostId = '',
    // 告警状态: all / unclose
    type = ALARM_TYPE_ALL,
    ...props
  }) {
    super(props)
    this.origin = origin
    this.isGroup = isGroup
    this.deviceType = deviceType
    this.level = level
    this.type = type
    this.hostId = hostId
  }

  get isAvailable () {
    return Boolean(
      this.type
    )
  }

  fetch () {
    return ViewDataService
      .alarmData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (dataList = []) {
    return dataList
      .map(({
        alias = '', collect = '', origin = '',
        level1 = 0, level2 = 0, level3 = 0, level4 = 0, level5 = 0
      }) => ({
        legend: alias,
        time: this.formatTime(collect, this.isGroup),
        name: origin,
        level1,
        level2,
        level3,
        level4,
        level5
      }))
      .sort((a, b) => {
        return compare(a.time, b.time)
      })
  }
}
