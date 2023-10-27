// 告警分级统计
import moment from 'moment'
import _ from 'lodash'
function weekList () {
  const dateArray = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - i) // 获取当前日期减去i天的日期

    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`
    dateArray.push(formattedDate) // 将格式化后的日期添加到数组
  }
  return dateArray
}
export const peizhi = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {
    right: '0%',
    orient: 'vertical',
    top: '13%',
    itemGap: 30,
    textStyle: {
      color: '#B0BDCD',
      padding: [5, 10, 5, 10]
    }
  },
  grid: {
    width: '830px',
    height: '250px',
    top: 'middle',
    right: '5%',
    left: '10%'
  },
  xAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: weekList(),
    splitLine: {
      show: false
    },
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    lineStyle: {
      color: '#fff'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  series: [
    {
      name: '告警数量',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 302, 301, 334, 390, 330, 320]
    },
    {
      name: '进程数量',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '平均进程数量',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    }
  ]
}
// 告警处置统计
export const dealStatics = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    orient: 'horizontal',
    textStyle: {
      color: '#B0BDCD'
    }
  },
  grid: {
    width: '800px',
    height: '250px',
    top: 'middle',
    right: '5%'
  },
  xAxis: {
    type: 'category',
    data: ['BJ2通知组', 'XM1通知组', 'XM2通知组', '动环通知组'],
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#A9B7C8'
    },
    lineStyle: {
      color: '#fff'
    },
    axisLine: {
      lineStyle: {
        color: '#FFF'
      }
    }
  },
  series: [
    {
      name: '告警数据',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: '进程数量',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },

    {
      name: '平均进程数量',
      type: 'bar',
      stack: 'Search Engine',
      emphasis: {
        focus: 'series'
      },
      data: [620, 732, 701, 734, 1090, 1130, 1120]
    }
  ]
}
// 过去7天所有告警
export const pass7DayAllAlarmData = (chartData = [], type = 'main') => {
  return {
    color: (type === 'main' ? 'rgba(0, 237, 255, 0.7)' : 'rgba(255, 112, 112, 0.7)'),
    xAxis: {
      type: 'category',
      data: chartData.map(el => _.get(el, 'collect', '')),
      axisLabel: {
        fontSize: '12px',
        fontWeight: '400',
        color: '#A9B7C8'
      },
      axisLine: {
        lineStyle: {
          color: '#FFF'
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLabel: {
        fontSize: '12px',
        fontWeight: '400',
        color: '#A9B7C8'
      },
      lineStyle: {
        color: '#fff'
      },
      axisLine: {
        lineStyle: {
          color: '#FFF'
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return `${params[0].name}: ${params[0].value}条`
      }
    },
    grid: {
      top: 'middle',
      width: '400px',
      height: '80px'
    },
    textStyle: {
      fontSize: 12,
      fontStyle: 'normal',
      fontColor: '#fff'
    },
    series: [
      {
        data: chartData.map(el => Number(_.get(el, 'total', ''))),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: (type === 'main' ? 'rgba(0, 237, 255, 0.7)' : 'rgba(255, 112, 112, 0.7)') // 0% 处的颜色
            }, {
              offset: 1, color: (type === 'main' ? 'rgba(0, 237, 255, 0)' : 'rgba(255, 112, 112, 0)') // 100% 处的颜色
            }]
          }
        }
      }
    ]
  }
}

export const pieData = {
  title: {
    subtextStyle: {
      fontSize: 18
    },
    subtext: '北京Pigoss',
    left: 'center',
    top: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    show: false
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: 'middle',
      silent: true,
      invisible: true, // 如果没有数据，则显示文本
      style: {
        fill: '#9d9d9d',
        fontWeight: 'bold',
        text: '暂无数据',
        fontFamily: 'Microsoft YaHei',
        fontSize: '250%'
      }
    }
  ]
}
