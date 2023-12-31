import Vue from 'vue'
import { USER } from '@/store/mutation-types'
// import { ALLPERMISSION } from '@/utils/menu'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    // const actionName = binding.arg || binding.value
    // const roles = store.getters.roles
    const roles = Vue.ls.get(USER)
    const elVal = vnode.context.$route.meta.permission
    if (!elVal || !elVal.length) {
      return
    }
    const [permissionId] = elVal instanceof String && [elVal] || elVal
    // const currentPermission = ALLPERMISSION.find(item => item.code === permissionId)
    // const permissionGroup = ALLPERMISSION.find(item => item.code === currentPermission.parentCode)
    // TODO 还有些按钮权限未添加，后续优化
    // console.log(permissionId);
    // console.log(roles.menuCodes.includes(permissionId));
    if (!roles.menuCodes.includes(permissionId)) {

    } else {
      // console.log(roles.menuCodes.indexOf(binding.arg) > -1);
      if (roles.menuCodes.indexOf(binding.arg) > -1 === false) {
        el.style.display = 'none' || el.parentNode && el.parentNode.removeChild(el)
      }
      /*  roles.menuCodes.forEach(p => {
        console.log(p);

        // if (p.code === permissionGroup.code || p.code === permissionGroup.parentCode) {
        //   // console.log(p.actionEntitySet.map(item => ({ code: item.code, name: item.name })))
        //   if (p.actionList && !p.actionList.includes(actionName)) {
        //     el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
        //   }
        // }
        console.log(p.indexOf(binding.arg) > -1);
        if (!roles.menuCodes.indexOf(binding.arg) > -1) {
          el.style.display = 'none' || el.parentNode && el.parentNode.removeChild(el)
        }
        // if (!permissionId.includes(p.permissionId)) {
        //   return
        // }
        // if (p.actionList && !p.actionList.includes(actionName)) {
        //   el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
        // }
      }) */
    }
  }
})

export default action
