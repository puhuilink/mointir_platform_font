import apollo from '@/utils/apollo'
import {
  queryRouteList,
  queryPlanList,
  queryUserGroupList,
  queryTaskInfo,
  queryTaskCiList,
  queryTaskKpi,
  updatePlan,
  deleteRouteArr,
  deletePlanArr
} from '../graphql/patrol'

// get
export const getRouteList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryRouteList,
    variables: {
      ...variables
    }
  })
}

export const getPlanList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryPlanList,
    variables: {
      ...variables
    }
  })
}

export const getUserGroupList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryUserGroupList,
    variables: {
      ...variables
    }
  })
}

export const getTaskInfoList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryTaskInfo,
    variables: {
      ...variables
    }
  })
}

export const getTaskCiList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryTaskCiList,
    variables: {
      ...variables
    }
  })
}

export const getTaskKpi = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryTaskKpi,
    variables: {
      ...variables
    }
  })
}
// mutation
export const mutatePlan = function (variables = {}) {
  return apollo.clients.patrol.mutate({
    mutation: updatePlan,
    variables: {
      ...variables
    }
  })
}
// delete
export const deleteRoute = function (variables = {}) {
  return apollo.clients.patrol.mutate({
    mutation: deleteRouteArr,
    variables: {
      ...variables
    }
  })
}

export const deletePlan = function (variables = {}) {
  return apollo.clients.patrol.mutate({
    mutation: deletePlanArr,
    variables: {
      ...variables
    }
  })
}