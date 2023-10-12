import Vue from 'vue'
import { UserService, AuthorizeObjectService } from '@/api'
import { decrypt } from '@/utils/aes'
import { ACCESS_TOKEN, USER, ROLES, SHOW_USER } from '@/store/mutation-types'
import { getTree, getButtonTree } from '@/utils/util'
import router from '@/router'

function generatePermission (user) {
  return new Promise(async (resolve, reject) => {
    const originalPermission = []
    const organizeList = (user.organizeList || []).filter(v => !!v)

    // 获取用户所属工作组的权限 、并合并
    // const permissionList = await UserService.getAllPermission()
    const results = await Promise.all([
      ...organizeList.map(organize => AuthorizeObjectService.getGroupPermission(organize.groupId)),
      AuthorizeObjectService.getUserPermission(user.userId)
    ])
    const status = results.map(result => result.code === 200).reduce((pre, cur) => pre && cur)
    const permissionList = results.flatMap(item => item.data)
    if (!status) {
      reject(new Error('用户权限数据获取失败，请稍后尝试！'))
    }
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
    buttonOriginalPermission.forEach(el => permissionTree.allPermission.push(el.code))
    const userPermission = Object.assign({}, user, permissionTree)
    resolve(userPermission)
  })
}

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
      const originalUser = Vue.ls.get(USER)
      originalUser.staffName = name
      originalUser.name = name
      Vue.ls.set(USER, originalUser)
      state.name = name
      state.info.staffName = name
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
          const roles = Vue.ls.get(ROLES) || {}
          let userPermission
          // 同一用户可直接使用上次配置
          if (user.userId === roles.userId && user.token === roles.token) {
            userPermission = roles
          } else {
            userPermission = await generatePermission(user)
          }
          if (userPermission.permissions && userPermission.permissions.length > 0) {
            commit('SET_ROLES', userPermission)
            commit('SET_INFO', {
              ...userPermission,
              ...user
            })
            Vue.ls.set(ROLES, userPermission)
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
      UserService.seondLogin({ userId: 'mZ4ImnGXmqK', pwd: '9ZAauDJ8S2Nd9' })
        .then(({ data }) => data)
        .then(decrypt)
        .then(JSON.parse)
        .then(({ organizeList = [], ...user }) => {
          Vue.ls.set(SHOW_USER, user)
        })
      return UserService.login(userInfo)
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
      return UserService.logout(state.token)
        .finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(USER)
          router.push('/user/login').then(() => {
            // 通过 reload 强制触发 src/core/directives/actions 刷新，以保证切换账号时权限得以重置
            location.reload()
          })
        })
    }

  }
}

export default user
