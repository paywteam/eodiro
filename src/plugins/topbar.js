/*! topbar 0.1.3, 2014-12-09
 *  http://buunguyen.github.io/topbar
 *  Copyright (c) 2014 Buu Nguyen
 *  Licensed under the MIT License */
'use strict'

// https://gist.github.com/paulirish/1579671
;(function () {
  let lastTime = 0
  const vendors = ['ms', 'moz', 'webkit', 'o']
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame']
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(function () {
        // eslint-disable-next-line standard/no-callback-literal
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
})()

let canvas
let progressTimerId
let fadeTimerId
let currentProgress
let showing
const addEvent = function (elem, type, handler) {
  if (elem.addEventListener) {
    elem.addEventListener(type, handler, false)
  } else if (elem.attachEvent) {
    elem.attachEvent('on' + type, handler)
  } else {
    elem['on' + type] = handler
  }
}
const options = {
  autoRun: true,
  barThickness: 2,
  barColors: {
    '0': 'rgba(0,0,0,0.9)',
    // '.25': 'rgba(52,  152, 219, .9)',
    // '.50': 'rgba(241, 196, 15,  .9)',
    // '.75': 'rgba(230, 126, 34,  .9)',
    '1.0': 'rgba(0,0,0,0.9)'
  },
  shadowBlur: 10,
  shadowColor: 'rgba(0,   0,   0,   .6)'
}
const repaint = function () {
  canvas.width = window.innerWidth
  canvas.height = options.barThickness * 5 // need space for shadow

  const ctx = canvas.getContext('2d')
  ctx.shadowBlur = options.shadowBlur
  ctx.shadowColor = options.shadowColor

  const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  for (const stop in options.barColors) {
    lineGradient.addColorStop(stop, options.barColors[stop])
  }
  ctx.lineWidth = options.barThickness
  ctx.beginPath()
  ctx.moveTo(0, options.barThickness / 2)
  ctx.lineTo(
    Math.ceil(currentProgress * canvas.width),
    options.barThickness / 2
  )
  ctx.strokeStyle = lineGradient
  ctx.stroke()
}
const createCanvas = function () {
  canvas = document.createElement('canvas')
  const style = canvas.style
  style.position = 'fixed'
  style.top = style.left = style.right = style.margin = style.padding = 0
  style.zIndex = 100001
  style.display = 'none'
  document.body.appendChild(canvas)
  addEvent(window, 'resize', repaint)
}
const topbar = {
  config (opts) {
    for (const key in opts) {
      if (options.hasOwnProperty(key)) {
        options[key] = opts[key]
      }
    }
  },
  show () {
    if (showing) {
      return
    }
    showing = true
    if (fadeTimerId !== null) {
      window.cancelAnimationFrame(fadeTimerId)
    }
    if (!canvas) {
      createCanvas()
    }
    canvas.style.opacity = 1
    canvas.style.display = 'block'
    topbar.progress(0)
    if (options.autoRun) {
      (function loop () {
        progressTimerId = window.requestAnimationFrame(loop)
        topbar.progress('+' + 0.05 * (1 - Math.sqrt(currentProgress)) ** 2)
      })()
    }
  },
  progress (to) {
    if (typeof to === 'undefined') {
      return currentProgress
    }
    if (typeof to === 'string') {
      to =
        (to.includes('+') || to.includes('-') ? currentProgress : 0) +
        parseFloat(to)
    }
    currentProgress = to > 1 ? 1 : to
    repaint()
    return currentProgress
  },
  hide () {
    if (!showing) {
      return
    }
    showing = false
    if (progressTimerId != null) {
      window.cancelAnimationFrame(progressTimerId)
      progressTimerId = null
    }
    (function loop () {
      if (topbar.progress('+.1') >= 1) {
        canvas.style.opacity -= 0.05
        if (canvas.style.opacity <= 0.05) {
          canvas.style.display = 'none'
          fadeTimerId = null
          return
        }
      }
      fadeTimerId = window.requestAnimationFrame(loop)
    })()
  }
}

export default topbar