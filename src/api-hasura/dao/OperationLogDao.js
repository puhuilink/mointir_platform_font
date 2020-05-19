import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'

class OperationLogDao extends BaseDao {
// 对应 hasura schema
@readonly
static SCHEMA = 't_cmdb_operationLog'

// 对应 vue-apollo
@readonly
  static PROVIDER = alert

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id']
  ])
}

export {
  OperationLogDao
}