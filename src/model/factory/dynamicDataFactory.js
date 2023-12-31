/**
 * 动态数据工厂
 */

import _ from 'lodash'

import AlarmListDynamicDataConfig from '../config/dataConfig/dynamicData/AlarmListDynamicDataConfig'
import BarDynamicDataConfig from '../config/dataConfig/dynamicData/BarDynamicDataConfig'
import DegreeDynamicDataConfig from '../config/dataConfig/dynamicData/DegreeDynamicRingDataConfig'
import GaugeDynamicDataConfig from '../config/dataConfig/dynamicData/GaugeDynamicDataConfig'
import LinesDynamicDataConfig from '../config/dataConfig/dynamicData/LinesDynamicDataConfig'
import ListDynamicDataConfig from '../config/dataConfig/dynamicData/ListDynamicDataConfig'
import PieDynamicDataConfig from '../config/dataConfig/dynamicData/PieDynamicDataConfig'
import PolarDynamicDataConfig from '../config/dataConfig/dynamicData/PolarDynamicDataConfig'
import TextHealthDynamicDataConfig from '../config/dataConfig/dynamicData/TextHealthDynamicDataConfig'
import { GlobalDynamicDataConfig } from '../config/dataConfig/dynamicData/GlobalDynamicDataConfig'
import MoreDynamicDataConfig from '@/model/config/dataConfig/dynamicData/MoreDynamicDataConfig'
import TabDynamicDataConfig from '@/model/config/dataConfig/dynamicData/TabDynamicDataConfig'
import PercentDynamicDataConfig from '@/model/config/dataConfig/dynamicData/PercentDynamicDataConfig'
import ToLineDynamicDataConfig from '@/model/config/dataConfig/dynamicData/ToLineDynamicDataConfig'

export default class DynamicDataFactory {
  static map = new Map([
    ['AlarmList', AlarmListDynamicDataConfig],
    ['Bar', BarDynamicDataConfig],
    ['DegreeRing', DegreeDynamicDataConfig],
    ['Gauge', GaugeDynamicDataConfig],
    ['Lines', LinesDynamicDataConfig],
    ['List', ListDynamicDataConfig],
    ['Pie', PieDynamicDataConfig],
    ['Polar', PolarDynamicDataConfig],
    ['TextHealth', TextHealthDynamicDataConfig],
    ['Global', GlobalDynamicDataConfig],
    ['More', MoreDynamicDataConfig],
    ['Percent', PercentDynamicDataConfig],
    ['ToLine', ToLineDynamicDataConfig],
    ['NewAlarm', ListDynamicDataConfig],
    ['Tab', TabDynamicDataConfig]
  ])

  static create (type, dbDataConfig) {
    const targetClass = this.map.get(_.upperFirst(type))
    if (targetClass) {
      return Reflect.construct(targetClass, [dbDataConfig])
    } else {
    }
  }
}
