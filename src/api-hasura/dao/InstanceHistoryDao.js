import { ModelDao } from './ModelDao'
import { readonly } from 'core-decorators'

class InstanceHistoryDao extends ModelDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_instanceHistory'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id']
  ])
}

export {
  InstanceHistoryDao
}
