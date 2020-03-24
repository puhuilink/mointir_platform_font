import apollo from '@/utils/apollo'
import {
  mutationUpdateModel,
  mutationInsertModels,
  queryResourceModelList,
  queryModelList,
  queryInsanceList,
  queryKpiList,
  queryKpiSelectList
} from '../graphql/Resource'
import { oldRequest } from '@/utils/oldRequest'
import { modelMapping } from '../mapping/Resource'
import store from '@/store'

export const getResourceInstanceList = function () {
  return apollo.clients.resource.query({
    query: queryResourceModelList
  }).then(r => r.data)
}

export const getModelList = function (withChildren = false) {
  return apollo.clients.resource.query({
    query: queryModelList,
    variables: {
      withChildren
    }
  }).then(r => r.data)
}

export const getInstanceList = function (where = {}) {
  return apollo.clients.resource.query({
    query: queryInsanceList,
    variables: {
      where
    }
  }).then(r => r.data)
}

export const getKpiList = function (where = {}) {
  return apollo.clients.resource.query({
    query: queryKpiList(where),
    variables: {
      where: {
        ...where,
        'parentname_s': {
          '_eq': 'Kpi'
        }
      }
    }
  }).then(r => r.data)
}

export const getKpiSelectList = function (nodeType = '') {
  return apollo.clients.resource.query({
    query: queryKpiSelectList(nodeType),
    variables: {
      'nodeType': nodeType
    }
  }).then(r => {
    // 此处查询出 nodeType 为 nodeType 和 CommonCI 时的并集
    // 当 nodeType !== CommonCi 时查询出两个结果
    const { data, data2 } = r.data
    return {
      data: [
        ...data,
        ...data2 || []
      ]
    }
  })
}

/**
 * 更新模型
 * @param {Number} did 主键
 * @param {Objetc} set 增量内容
 */
export const editModel = function (did, set = {}) {
  return apollo.clients.resource.mutate({
    mutation: mutationUpdateModel,
    variables: {
      did,
      set
    }
  })
}

/**
 * 旧系统更新模型
 */
export const editModelOld = function (did, set = {}) {
  const data = {}
  Object.keys(set).forEach(key => {
    if (modelMapping[key]) {
      data[modelMapping[key]] = set[key]
    }
  })
  return oldRequest.post('/urmp/api/rest/post/modelService/update', [data, '', []])
}

/**
 * （批量）新增资源模型
 * TODO: 数组参数改为对象
 * @param {Array} objects
 * @return {*}
 */
export const addModels = function (objects = []) {
  // return addModelsOld(objects)
  // （旧系统的）构建树方式，是认为 name_s 唯一的
  return apollo.clients.resource.mutate({
    mutation: mutationInsertModels,
    variables: {
      objects
    }
  })
}

/**
 * 旧系统（批量）新增资源模型
 * TODO: 数组参数改为对象
 * @param {Array} objects
 * @return {*}
 */
export const addModelsOld = function (objects = []) {
  const [object] = objects
  const data = {}
  Object.keys(object).forEach(key => {
    if (modelMapping[key]) {
      data[modelMapping[key]] = object[key]
    }
  })
  return oldRequest.post('/urmp/api/rest/post/modelService/add', [data, data.parentName, '', []])
}

export const deleteModel = function (name) {
  // return deleteModelOld(name)
}

export const deleteModelOld = function (name) {
  return oldRequest.post('/urmp/api/rest/post/modelService/remove', [
    name,
    store.state.user.name,
    ['']
  ])
}
