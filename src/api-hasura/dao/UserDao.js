import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'

class UserDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_user'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = imp

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['user_id', 'email', 'mobile_phone']

  // 主键
  @readonly
  static PRIMARY_KEY = 'user_id'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['user_id', '用户名'],
    ['email', 'Email'],
    ['mobile_phone', '移动电话']
  ])

  @override
  static async find ({ orderBy = { createdate: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }

  @override
  static async add (user) {
    await this._uniqueValidate(user)
    return super.add({
      auth_method: 'DB',
      ...user,
      ...defaultCreateDate()
    })
  }

  @override
  static async update ({ ...user }, { user_id }) {
    await this._uniqueValidate({ ...user, user_id }, false)
    return super.update({ ...user, ...defaultUpdateDate() }, { user_id })
  }
}

export {
  UserDao
}
