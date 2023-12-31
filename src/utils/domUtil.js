import { Observable } from 'rxjs'

export const setDocumentTitle = function (title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const domTitle = '中国交建·统一监控管理平台'

export function copyText (value = '') {
  const transfer = document.createElement('input')
  document.body.appendChild(transfer)
  transfer.value = value
  transfer.focus()
  transfer.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
  }
  transfer.blur()
  document.body.removeChild(transfer)
}

export function observeOnMutation (target, config) {
  return new Observable((observer) => {
    const mutation = new MutationObserver((mutations, instance) => {
      observer.next(mutations)
    })
    mutation.observe(target, config)
    const unsubscribe = () => {
      mutation.disconnect()
    }
    return unsubscribe
  })
}
