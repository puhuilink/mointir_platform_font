// 基准大小
let baseSize

// 设置 rem 函数
function setRem () {
  // 当前页面宽度相对于 1920 宽的缩放比例，可根据自己需要修改。
  const html = document.querySelector('html')
  const width = html.clientWidth
  let scale = 0
  if (width >= 2560) {
    scale = document.documentElement.clientWidth / 2560
    baseSize = 20
  } else if (width >= 1920) {
    scale = document.documentElement.clientWidth / 1920
    baseSize = 18
  } else if (width >= 1745) {
    scale = document.documentElement.clientWidth / 1745
    baseSize = 16
  } else if (width >= 1536) {
    scale = document.documentElement.clientWidth / 1536
    baseSize = 14
  } else if (width >= 1280) {
    scale = document.documentElement.clientWidth / 1280
    baseSize = 12
  } else {
    scale = document.documentElement.clientWidth / 1024
  }
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + 'px'
}

// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
