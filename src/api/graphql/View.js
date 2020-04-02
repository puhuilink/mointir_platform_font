import gql from 'graphql-tag'

// 查询视图列表
export const queryViewList = gql`query ($where: t_view_bool_exp! = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_view_order_by!] = {view_id: desc}) {
  pagination: t_view_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: t_view (limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    view_id
    view_title
    view_name
    view_type
    creator
    view_img
  }
}`

// 更新视图
export const mutationUpdateView = gql`mutation ($viewId: numeric!, $set: t_view_set_input! = {}) {
  update_t_view (
    where: {
      view_id: {
        _eq: $viewId
      }
    }
    _set:$set
  ) {
    affected_rows
  }
}`

// 新建视图
export const mutationInsertViews = gql`mutation ($objects: [t_view_insert_input!]! = []) {
  insert_t_view (objects: $objects) {
    affected_rows
  }
}`

/**
 * 根据传入的 Array<{ kpi_code, ci_id }> 拼接视图组件查询语句
 * @param {Array<Object>} options
 * @return {String}
 */
export const generateDynamicQueryWithKpiCi = (options = []) => {
  // hasura 每条数据的返回值键名不能重复，此处以索引做区分，后期再合并为数组
  /* eslint-disable */
  return options.map(({ kpi_code, ci_id }, index) => (
    `data${index}: t_kpi_current(where: {
      _and: {
        kpi_code: {_eq: ${kpi_code}},
        ci_id: {_eq: "${ci_id}"}}
    }) {
      value: kpi_value_num
      kpi_code
      ci_id
    }`
  ))
}

/**
 * 根据传入的[kpi_code_s]与[_id_s]查询对应kpi和instance的label
 */
export const queryKpiAndInstanceInfo = gql`query ($instanceIdList: [String!], $kpiCodeList: [String!]) {
  instanceList: ngecc_instance(where: {_id_s: {_in: $instanceIdList}}) {
    label_s
    _id_s
  }
  kpiList: ngecc_instance_values(where: {kpicode_s: {
    _in: $kpiCodeList
  }}) {
    label_s
    kpicode_s
  }
}`