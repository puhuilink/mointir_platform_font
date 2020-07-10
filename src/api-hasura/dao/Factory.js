import _ from 'lodash'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

/**
 * 静态类工厂
 */
export class StaticFactory {
  static create = () => {
    const requirePlugins = require.context('./', true, /Dao.js$/)
    const exposed = {}

    requirePlugins.keys().forEach((fileName) => {
      const className = fileName.replace(/(\.)*(\/)*(js)*/g, '')
      exposed[className] = requirePlugins(fileName)[className]
    })

    return exposed
  }
}

/**
 * 动态类工厂
 */
export class DynamicFactory {
  static create = mapping => {
    const exposed = {};
    [...mapping].forEach(([schema, config]) => {
      const { primaryKey, provider } = config
      const className = _.upperFirst(
        _.camelCase(
          schema.replace(/^[t_v_]/g, '')
        )
      ) + 'Dao'

      exposed[className] = class extends BaseDao {
        @readonly
        static SCHEMA = schema

        @readonly
        static PROVIDER = provider

        @readonly
        static PRIMARY_KEY = primaryKey
      }
    })

    return exposed
  }
}