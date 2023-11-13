import echarts from 'echarts'

const backgroundColor = 'rgba(2,2,1)'
// 版图颜色
const areaColor = '#063d93'
// 移入版图颜色
const hoverColor = '#98B3CC'
// 版图边缘颜色
const borderColor = '#aaaaaa'
// 连线颜色渐变始
const lineColor = ['rgba(35,200,155, 1)', 'rgba(35,200,155, 1)']
// 连线颜色渐变终
// 版图文字颜色
const fontColor = '#666'

export const defaultOption = {
  backgroundColor: backgroundColor,
  legend: {
    show: true,
    orient: 'vertical',
    top: 'bottom',
    left: 'right',
    data: ['地区'],
    textStyle: {
      color: '#fff'
    }
  },
  geo: {
    map: 'worldAndChina',
    label: {
      color: fontColor,
      emphasis: {
        show: false,
        disabled: true
      },
      show: true
    },
    roam: true,
    center: [104.55, 35.32],
    zoom: 1.23,
    itemStyle: {
      normal: {
        areaColor: areaColor,
        borderColor: borderColor
      },
      emphasis: {
        areaColor: hoverColor
      }
    }
  },
  series: [{
    name: '地点',
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    rippleEffect: {
      brushType: 'fill'
    },
    label: {
      show: true,
      position: 'top',
      formatter: '{b}',
      color: '#fff'
    },
    symbolSize: 3,
    showEffectOn: 'render',
    itemStyle: {
      normal: {
        color: '#46bee9'
      }
    },
    data: []
  }, {
    name: '省份',
    type: 'scatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    rippleEffect: {
      brushType: 'fill'
    },
    label: {
      show: true,
      position: 'right',
      formatter: '{b}'
    },
    symbolSize: 2,
    showEffectOn: 'render',
    itemStyle: {
      normal: {
        color: 'transparent'
      }
    },
    data: []
  }, {
    name: '线路',
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 2,
    large: true,
    effect: {
      show: true,
      constantSpeed: 20,
      symbol: 'pin',
      symbolSize: 3,
      trailLength: 0
    },
    lineStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
          offset: 0,
          color: lineColor[0]
        }, {
          offset: 1,
          color: lineColor[1]
        }], false),
        width: 3,
        opacity: 0.7,
        curveness: 0.5
      }
    }
  },
  {
    name: '严重告警线路',
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 2,
    large: true,
    effect: {
      show: true,
      constantSpeed: 20,
      symbol: 'pin',
      symbolSize: 3,
      trailLength: 0
    },
    lineStyle: {
      normal: {
        color: '#f35555',
        width: 5,
        opacity: 0.7,
        curveness: 0.5
      }
    }
  }
  ]
}
