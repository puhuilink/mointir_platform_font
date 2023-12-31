import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import {
  ModelHostDao,
  ModelHostEndpointDao,
  ModelEndpointMetricDao,
  ModelHostGroupByModelDao,
  ModelHostGroupByHostTypeDao
} from '../dao/index'
class ModelService extends BaseService {
  static async tree () {
    const { data: { hostList } } = await query(
      ModelHostDao.find({
        // where:
        fields: [
          'id',
          'host',
          `endpointRelation {
            endpoint {
              id
              alias
            }
          }`
        ],
        alias: 'hostList'
      })
    )
    const treeData = hostList.map(host => ({
      title: host.host,
      key: host.id,
      children: host.endpointRelation
        .filter(({ endpoint }) => !!endpoint)
        .map(({ endpoint }) => ({
          title: endpoint.alias,
          key: endpoint.id
        }))
    }))
    return treeData
  }

  /**
   * 查询所有 host 模型的 host_type
   */
  static async modelHostTypeList () {
    const { data: { modelHostTypeList } } = await query(
      ModelHostGroupByHostTypeDao.find({
        fields: [
          'key: id',
          'host',
          'host_type'
        ],
        alias: 'modelHostTypeList'
      })
    )
    return modelHostTypeList.map(el => ({
      ...el,
      label: el['host'] || el['host_type']
    }))
  }

  /**
   * 查询 host 模型下的 endpoint 列表
   * @param {Number} modelHostId t_model_host.host_id
   */
  static async endpointList (value) {
    const { data: { modelHostEndpointList } } = await query(
      // TODO: hack
      ModelHostEndpointDao.find({
        where: {
          ...typeof value === 'string' ? {
            host: {
              host_type_dict_value_code: {
                _eq: value
              }
            }
          } : {
            host_id: value
          }
          // host_id: modelHostId
          // enable: true
        },
        fields: [
          `endpoint {
            id
            alias
            collect_type
          }`
        ],
        alias: 'modelHostEndpointList'
      })
    )

    const validList = modelHostEndpointList
      .filter(({ endpoint }) => endpoint && endpoint.id)
      .map(({ endpoint }) => ({
        key: endpoint.id,
        label: endpoint.alias + (endpoint.collect_type ? endpoint.collect_type : '')
      }))
    const uniqList = _.uniq(validList, ({ key }) => key)
    return uniqList
  }

  static async endpointModelsByHostTypeDictValueCode (host_type_dict_value_code) {
    return this.endpointList(host_type_dict_value_code)
  }

  /**
   * 查询 endpoint 模型下的 metric 列表
   * @param {Number} endpointModel t_model_endpoint.endpoint_id
   */
  static async metricList (endpointModel) {
    const { data: { modelEndpointMetricList } } = await query(
      ModelEndpointMetricDao.find({
        where: {
          endpoint_id: endpointModel
          // enable: true
        },
        fields: [
          `metric {
            id
            alias
          }`
        ],
        alias: 'modelEndpointMetricList'
      })
    )
    const validList = modelEndpointMetricList
      .filter(({ metric }) => metric && metric.id)
      .map(({ metric }) => ({
        key: metric.id,
        label: metric.alias
      }))
    const uniqList = _.uniq(validList, ({ key }) => key)
    return uniqList
  }

  static async metricModelsByEndpointModelId (endpointModelId) {
    return this.metricList(endpointModelId)
  }

  static async hostFind (argus = {}) {
    return query(
      ModelHostDao.find(argus)
    )
  }

  static async hostsByHostTypeDictValueCode (host_type_dict_value_code) {
    return ModelService.hostFind({
      where: { host_type_dict_value_code },
      fields: [
        `children {
          label: alias
          key: id
        }`
      ],
      alias: 'dataSource'
    }).then(r => r.data.dataSource || [])
      .then((dataSource = []) => {
        const data = dataSource.filter(el => el.children && el.children.length).map(el => el.children).flat()
        return data
      })
  }

  static async groupByModelFind (argus = {}) {
    return query(
      ModelHostGroupByModelDao.find(argus)
    )
  }
}

export {
  ModelService
}
