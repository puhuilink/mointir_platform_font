import Vue from 'vue'
import { logout } from '@/api/login'
import { getGroupPermission, getUserPermission } from '@/api/system'
import { decrypt } from '@/utils/aes'
import { ACCESS_TOKEN, USER } from '@/store/mutation-types'
import { getTree, getButtonTree } from '@/utils/util'
import { login } from '@/api/controller/User'
// import { UserService } from '@/api-hasura'
// import _ from 'lodash'
import router from '@/router'

const user = {
  state: {
    // 后台接口 jwt
    token: '',
    // 用户名称
    name: '',
    // 用户头像
    avatar: '',
    // 用户角色（组）与权限
    roles: [],
    // 用户个人信息详情
    info: {},
    // 用户 id
    userId: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ID: (state, { userId }) => {
      state.userId = userId
    }
  },
  actions: {
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = Vue.ls.get(USER)
          const originalPermission = []
          const organizeList = (user.organizeList || []).filter(v => !!v)

          // 获取用户所属工作组的权限 、并合并
          // const permissionList = await UserService.getAllPermission()
          const results = await Promise.all([
            ...organizeList.map(organize => getGroupPermission(organize.groupId)),
            getUserPermission(user.userId)
          ])
          const status = results.map(result => result.code === 200).reduce((pre, cur) => pre && cur)
          const permissionList = results.flatMap(item => item.data)
          if (!status) {
            reject(new Error('用户权限数据获取失败，请稍后尝试！'))
          }
          console.log(permissionList)
          permissionList.forEach(permission => {
            if (!originalPermission.some(item => item.code === permission.code)) {
              originalPermission.push(permission)
            }
          })
          // 菜单权限列表
          const menuOriginalPermission = []
          // const menuOriginalPermission = originalPermission.filter(item => /^F/.test(item.code))
          // 按钮权限列表
          const buttonOriginalPermission = []
          // const buttonOriginalPermission = originalPermission.filter(item => /^M/.test(item.code))

          originalPermission.forEach(item => {
            if (/^F/.test(item.code)) {
              menuOriginalPermission.push(item)
            } else if (/^M/.test(item.code)) {
              buttonOriginalPermission.push(item)
            }
          })

          const buttonTree = getButtonTree(null, buttonOriginalPermission)
          const permissionTree = getTree(null, menuOriginalPermission, buttonTree)
          const userPermission = Object.assign({}, user, permissionTree)

          // FIXME: 用户应有一些基本权限，比如视图展示（桌面）
          if (userPermission.permissions && userPermission.permissions.length > 0) {
            commit('SET_ROLES', userPermission)
            commit('SET_INFO', {
              ...userPermission,
              ...user
            })
          } else {
            reject(new Error('用户或其工作组未分配可访问的权限！'))
          }
          commit('SET_TOKEN', user.token)
          commit('SET_ID', user)
          commit('SET_NAME', { name: user.staffName })
          commit('SET_AVATAR', '/avatar.jpg')

          resolve(userPermission)
        } catch (e) {
          reject(e)
        }
      })
    },

    // 登录
    Login ({ commit }, userInfo) {
      return login(userInfo)
        .then(({ data }) => data)
        .then(decrypt)
        .then(JSON.parse)
        .then(({ organizeList = [], ...user }) => {
          // 后端接口工作组 bug 兼容
          user.organizeList = organizeList.filter(group => group && group.groupId)
          Vue.ls.set(ACCESS_TOKEN, user.token, 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USER, user)
          commit('SET_TOKEN', user.token)
          commit('SET_ID', user)
          commit('SET_NAME', { name: user.staffName })
          commit('SET_AVATAR', '/avatar.jpg')
        })
    },

    // 登出
    Logout ({ commit, state }) {
      return logout(state.token)
        .finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          router.push('/user/login')
        })
    }

  }
}

export default user
