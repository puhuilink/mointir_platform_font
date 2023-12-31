import {
  SEND_TYPE_EMAIL, SEND_TYPE_SMS,
  SEND_TYPE_MAPPING, ALL_SEND_TYPE_MAPPING
} from '@/tables/alarm_temp/types'

export const ALARM_RULE_MERGE = 'merge'
export const ALARM_RULE_UPGRADE = 'upgrade'
export const ALARM_RULE_FORWARD = 'forward'
export const ALARM_RULE_RECOVER = 'recover'

export {
  SEND_TYPE_EMAIL,
  SEND_TYPE_SMS,
  SEND_TYPE_MAPPING,
  ALL_SEND_TYPE_MAPPING
}

const ruleMappingArr = [
  [ALARM_RULE_MERGE, '告警合并'],
  [ALARM_RULE_UPGRADE, '告警升级'],
  [ALARM_RULE_RECOVER, '告警消除'],
  [ALARM_RULE_FORWARD, '告警通知']
]

export const ruleTypeMapping = new Map(ruleMappingArr)

export const allRuleTypeMapping = new Map([
  ['', '全部分类'],
  ...ruleMappingArr
])
