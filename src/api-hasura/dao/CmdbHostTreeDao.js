import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class CmdbHostTreeDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_host_tree'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  CmdbHostTreeDao
}