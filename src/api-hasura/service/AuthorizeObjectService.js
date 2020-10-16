import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { AuthorizeObjectDao, ViewDao, ViewDesktopDao } from '../dao'
import { OBJECT_TYPE } from '../dao/types/AuthorizeObject'
import _ from 'lodash'

class AuthorizeObjectService extends BaseService {
  static async find (argus = {}) {
    return query(
      AuthorizeObjectDao.find(argus)
    )
  }

  /**
   * 获取用户或工作组分配的视图id
   */
  static async viewIdList ({ user_id, group_id }) {
    const snippet = {
      ...user_id ? { user_id } : { group_id }
    }
    const { data: { authorizeList } } = await query(
      AuthorizeObjectDao.find({
        where: { ...snippet, object_type: OBJECT_TYPE.view },
        fields: ['object_id'],
        alias: 'authorizeList'
      })
    )
    const viewIdList = authorizeList.map(({ object_id }) => object_id)
    return viewIdList
  }

  /**
   * 获取用户或工作组分配的视图
   */
  static async viewList ({ user_id, group_id }) {
    const viewIdList = await this.viewIdList({ user_id, group_id })

    if (_.isEmpty(viewIdList)) {
      return []
    }

    const { data: { viewList } } = await query(
      ViewDao.find({
        where: { view_id: { _in: viewIdList } },
        fields: ['view_title', 'view_id'],
        alias: 'viewList'
      })
    )

    return viewList
  }

  static async allocateGroupView (group_id, viewIdList) {
    // 当前已分配的视图id
    const currentViewIdList = await this.viewIdList({ group_id })

    // 权限不变的视图id(求交集)
    const intersectionalViewIdList = _.intersection(currentViewIdList, viewIdList)
    // 权限被删除的视图id
    const abandonViewIdList = _.xorBy(
      currentViewIdList,
      intersectionalViewIdList,
      view_id => !currentViewIdList.includes(view_id)
    )

    await mutate(
      // 删除之前的视图权限
      AuthorizeObjectDao.batchDelete(({ group_id, object_type: OBJECT_TYPE.view })),
      // 全量更新现在的视图权限
      AuthorizeObjectDao.batchAdd(
        viewIdList.map(view_id => ({ group_id, object_id: view_id, object_type: OBJECT_TYPE.view }))
      ),
      // 删除曾经已分配到视图桌面上但现在无权限的视图
      ViewDesktopDao.batchDelete({ group_id, view_id: { _in: abandonViewIdList } })
    )
  }

  static async allocateUserView (user_id, viewIdList) {
    // 当前已分配的视图id
    const currentViewIdList = await this.viewIdList({ user_id })

    // 权限不变的视图id(求交集)
    const intersectionalViewIdList = _.intersection(currentViewIdList, viewIdList)
    // 权限被删除的视图id
    // currentViewIdList长度>=intersectionalViewIdList长度
    // intersectionalViewIdList中不包含的元素即为要删除的元素
    const abandonViewIdList = _.xorBy(
      intersectionalViewIdList,
      currentViewIdList,
      view_id => !intersectionalViewIdList.includes(view_id)
    )

    await mutate(
      // 删除之前的视图权限
      AuthorizeObjectDao.batchDelete(({ user_id, object_type: OBJECT_TYPE.view })),
      // 全量更新现在的视图权限
      AuthorizeObjectDao.batchAdd(
        viewIdList.map(view_id => ({ user_id, object_id: view_id, object_type: OBJECT_TYPE.view }))
      ),
      // 删除曾经已分配到视图桌面上但现在无权限的视图
      ViewDesktopDao.batchDelete({ user_id, view_id: { _in: abandonViewIdList } })
    )
  }
}

export {
  AuthorizeObjectService
}
