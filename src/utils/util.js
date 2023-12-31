import _ from 'lodash'
import scrollTo from 'ant-design-vue/lib/_util/scrollTo'
import { alarm } from '@/utils/request'
import { decrypt } from '@/utils/aes'

export {
  scrollTo
}

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['欢迎词', '欢迎词', '欢迎词', '欢迎词']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
export async function judgeRoleToAlertView () {
  try {
    const { data } = await alarm.get('/api/authentication/auth/get')
    const deData = decrypt(data)
    if (deData === '2') {
      await this.$router.push({ name: '600' })
    }
  } catch (e) {
    await this.$router.push({ name: '600' })
  }
}
export function sqlResultDealer (list) {
  if (list == null) {
    return null
  }
  if (list.length <= 1) {
    return null
  }
  const keys = list[0]
  const array = []
  for (let i = 1; i < list.length; i++) {
    const record = list[i]
    const temp = {}
    for (let j = 0; j < keys.length; j++) {
      temp[keys[j]] = record[j]
    }
    array.push(temp)
  }
  if (array.length > 0) {
    return array
  } else {
    return null
  }
}

export function dealQuery (result) {
  if (!result.length) {
    return []
  }
  const keys = result[0]
  const data = []
  for (let i = 1; i < result.length; i++) {
    const record = result[i]
    const ob = {}
    for (let j = 0; j < record.length; j++) {
      ob[keys[j]] = record[j]
    }
    data.push(ob)
  }
  return data
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/*
*  转换对象为驼峰写法
* */
export function camelExchange (arr) {
  const keys = Object.keys(arr)
  const newArr = {}
  keys.forEach((item, index) => {
    newArr[_.camelCase(item)] = arr[item]
  })
  return newArr
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 下载文件
 * @param fileName 文件名
 * @param content 文本内容
 */
export function downloadFile (fileName, content, options = {}) {
  const link = document.createElement('a')
  const blob = new Blob([content], options)
  link.download = fileName
  const href = URL.createObjectURL(blob)
  link.href = href
  const event = document.createEvent('MouseEvents')
  event.initMouseEvent('click', false, false)
  link.dispatchEvent(event)
  window.URL.revokeObjectURL(href)
}

export function downloadExcel (fileName, content) {
  return downloadFile(fileName, content, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  })
}

/**
 * 由原始权限列表，构建菜单级别权限树
 */
export function getMenuTree (tree, list) {
  if (!tree) {
    tree = {
      code: 'F',
      key: 'F'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.children = []
    childrenList.map(item => {
      item.key = item.code
      getMenuTree(item, list)
      return item
    })
    tree.children = childrenList
  }
  return tree
}

/**
 * 由原始权限列表，构建菜单级别权限树
 */
export function getButtonTree (tree, list) {
  if (!tree) {
    tree = {
      code: 'M',
      key: 'M'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.children = []
    childrenList.map(item => {
      item.key = item.code
      item.title = item.name
      getButtonTree(item, list)
      return item
    })
    tree.children = childrenList
  }
  return tree
}

// 全部视图权限
let allPermission = []
/**
 * 由原始权限列表，分离菜单权限数组，构建菜单树
 */
export function getTree (tree, list, buttonTree) {
  if (!tree) {
    tree = {
      code: 'F'
    }
  }
  const childrenList = list.filter(child => child.parentCode === tree.code)
  if (childrenList.length > 0) {
    tree.permissions = []
    childrenList.map(item => {
      const actions = (buttonTree.children || []).find(button => button.name === (item.name || ''))
      if (actions) {
        // hack
        actions.children = actions.children || []
        item.actionEntitySet = actions.children
        item.actionList = actions.children.map(action => action.code)
        item.permissionId = item.code
        item.permissionName = item.name
      }
      getTree(item, list, buttonTree)
      return item
    })
    tree.permissions = childrenList
    tree.permissionList = childrenList.map(item => item.code)
    tree.allPermission = allPermission = [...allPermission, ...tree.permissionList]
  }
  return tree
}

/**
 * 将菜单树与按钮树合并
 * @param menuTree
 * @param buttonTree
 */
export function mergePermission (menuTree, buttonTree) {
  if (menuTree.children && menuTree.children.length > 0) {
    menuTree.children.map(item => {
      const action = buttonTree.children.find(button => button.name === (item.name || ''))
      if (action) {
        item.action = action
      }
      mergePermission(item, buttonTree)
      return item
    })
  }
  return menuTree
}

export function isPromise (obj) {
  return (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export function filterTransferOption (key) {
  return function (inputValue = '', option) {
    const value = _.get(option, key, '')
    return value.toLowerCase().indexOf(
      inputValue.trim().toLowerCase()
    ) > -1
  }
}

export const filterOption = function (input = '', option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf((input).toLowerCase()) >= 0
  )
}

// antd input-number 整数格式化
export const parserInt = num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)

export const hexToRGBA = function (hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16)
  var g = parseInt(hex.slice(3, 5), 16)
  var b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}

export function enterFullscreen () {
  const requestMethod = document.documentElement.requestFullScreen || // W3C
    document.documentElement.webkitRequestFullscreen || // FireFox、safari
    document.documentElement.mozRequestFullScreen || // Chrome等
    document.documentElement.msRequestFullScreen // IE11
  if (!document.fullscreenElement) {
    requestMethod && requestMethod.call(document.documentElement)
  }
}

export function exitFullscreen () {
  if (!document.fullscreenElement) return
  const exitMethod = document.exitFullscreen || // W3C
  document.webkitExitFullscreen || // Chrome等
  document.mozCancelFullScreen || // FireFox
    document.msExitFullscreen // IE11

  if (document.exitFullscreen) {
    exitMethod && exitMethod.call(document)
  }
}

export function toggleFullscreen () {
  if (!document.fullscreenElement) {
    enterFullscreen()
  } else if (document.exitFullscreen) {
    exitFullscreen()
  }
}

/**
 * 截取小数位数
 * @param {*} value 要截取的值
 * @param {*} 保留小数的长度
 */
export const formatFloat = function (value, n = 0) {
  if (typeof value !== 'number') {
    console.warn(`${value}非number类型，无法处理小数位数`)
    return value
  }

  var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0 && n > 0) {
    s += '.'
  }
  for (var i = s.length - s.indexOf('.'); i <= n; i++) {
    s += '0'
  }
  return s
}

/**
 * 数组去空值
 */
export const removeEmpty = function (arr) {
  return arr.filter(el => !_.isEmpty(el))
}

/**
 * 检索一个对象中每个属性是否为空
 */
export const checkEmpty = function (array) {
  for (let i = 0; i < array.length; i++) {
    const obj = array[i]
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === undefined || obj[key] === '' || obj[key].length === 0)) {
        return false
      }
    }
  }
  return true
}

/**
 *  删除一个对象数组的属性
 */
export const deletePropertyFromArrayObjects = function (arr, prop) {
  return arr.map(({ [prop]: _, ...rest }) => rest)
}

/**
 * 添加一个对象数组的属性并赋初值
 * @param arr
 * @param prop
 * @param value
 * @returns {*}
 */
export const addPropertyToArrayObjects = function (arr, prop, value) {
  return arr.map(obj => ({ ...obj, [prop]: value }))
}

/**
 * 检查一个数组中是否有数据重复
 * @param arr
 * @param val
 * @returns {boolean}
 */
export const checkDuplicate = function (arr, val) {
  return arr.filter((x) => x === val).length > 1
}

/**
 * 深克隆一个Map对象
 * @param map
 * @returns {Map<any, any>}
 */
export const cloneMap = function deepCloneMap (map) {
  const clonedMap = new Map()

  for (const [key, value] of map) {
    if (typeof value === 'object' && value !== null) {
      clonedMap.set(key, deepCloneMap(value))
    } else {
      clonedMap.set(key, value)
    }
  }

  return clonedMap
}

export const removeArrayValue = function (arr = [], value) {
  if (arr.length === 0) {
    return arr
  } else {
    arr.splice(arr.indexOf(value), 1)
    return arr
  }
}

export const buildTree = function (data, parentId = null) {
  const tree = []
  for (const item of data) {
    if (item.parentId === parentId) {
      const children = buildTree(data, item.id)
      if (children.length > 0) {
        item.children = children.map(el => {
          return {
            ...el,
            title: el.name,
            key: el.id
          }
        })
      }
      tree.push({
        ...item,
        title: item.name,
        key: item.id
      })
    }
  }
  return tree
}
