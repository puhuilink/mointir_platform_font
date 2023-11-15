import icon from '../img/icon1.png'

export const pieData = {
  color: ['#25ae84', '#d0a91f', '#ea5115', '#930d10'],
  title: {
    left: 'left', // 标题位置
    top: 10, // 调整标题位置
    text: '{a|}使用富文本标题', // 使用富文本标题
    verticalAlign: 'bottom',
    textStyle: {
      rich: {
        a: {
          color: '#fff', // 标题文本颜色
          width: 26, // 图标宽度
          height: 26, // 图标高度
          lineHeight: 15,
          verticalAlign: 'bottom',
          backgroundColor: {
            image: icon // 图标的背景颜色，这里是图标
          }
        }
      },
      textBorderColor: '#333', // 标题文本的边框颜色
      textBorderWidth: 1, // 标题文本的边框宽度,
      color: '#fff',
      fontSize: 16,
      height: 30,
      lineHeight: 20
    }
  },
  grid: {
    left: '10%', // 调整图表位置，设置左边距
    containLabel: true // 将坐标轴的刻度标签等全部放入 grid 内部
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    icon: 'circle',
    left: 300,
    padding: [50, 15],
    itemGap: 30, // 图例间隔
    itemWidth: 40, // 图例宽度
    y: 'center',
    data: ['Active', 'Pending', 'Provisioning', 'Disabled'],
    formatter: function (name) {
      // 在这里自定义图例显示内容，将图例文字放在图例标记后面
      return '{a|} ' + name
    },
    textStyle: {
      fontSize: 12,
      color: '#fff',
      height: 8,
      rich: {
        a: {
          verticalAlign: 'bottom'
        }
      }
    }
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      selectedMode: 'single',
      left: -200,
      top: '10%',
      radius: ['45%', '75%'],
      label: {
        show: false
      },
      itemStyle: {
        borderWidth: 5,
        borderColor: 'rgb(16,12,42)'
      },
      data: [
        { value: 335, name: 'Active' },
        { value: 310, name: 'Pending' },
        { value: 234, name: 'Provisioning' },
        { value: 135, name: 'Disabled' }
      ]
    }
  ],
  graphic: [
    {
      type: 'text',
      left: '95',
      top: '130',
      style: {
        text: '1234',
        textAlign: 'right',
        fontSize: 20,
        fill: 'white',
        width: 50
      }
    },
    {
      type: 'text',
      left: '102',
      top: '160',
      style: {
        text: 'Total',
        textAlign: 'right',
        fontSize: 15,
        fontWeight: 'normal',
        fill: 'white',
        width: 50
      }
    }
  ]
}

export const lineData = {
  backgroundColor: '#100101',
  color: ['#f25d60', '#3fce65'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,.6)',
    borderColor: 'rgba(147, 235, 248, .8)',
    textStyle: {
      color: '#FFF'
    }
  },
  title: {
    left: 'left', // 标题位置
    top: 10, // 调整标题位置
    text: '{a|}使用富文本标题', // 使用富文本标题
    verticalAlign: 'bottom',
    textStyle: {
      rich: {
        a: {
          color: '#fff', // 标题文本颜色
          width: 26, // 图标宽度
          height: 26, // 图标高度
          lineHeight: 15,
          verticalAlign: 'bottom',
          backgroundColor: {
            image: icon // 图标的背景颜色，这里是图标
          }
        }
      },
      textBorderColor: '#333', // 标题文本的边框颜色
      textBorderWidth: 1, // 标题文本的边框宽度,
      color: '#fff',
      fontSize: 16,
      height: 30,
      lineHeight: 20
    }
  },

  grid: {
    left: '2%',
    right: '5%',
    bottom: '10%',
    top: '20%',
    containLabel: true
  },

  legend: {
    show: true,
    icon: 'circle',
    orient: 'horizontal',
    left: 'center',
    bottom: 'bottom',
    itemWidth: 12,
    itemHeight: 12,
    formatter: ['{a|{name}}'].join('\n'),
    textStyle: {
      fontSize: 12,
      color: '#6A93B9',
      height: 8,
      rich: {
        a: {
          verticalAlign: 'bottom'
        }
      }
    },
    data: ['rx(Mbps)', 'tx(Mbps)']
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#152c52',
        fontSize: 12
      }
    },
    axisLabel: {
      // interval:0,
      color: '#7691b5',
      fontSize: 12
    },
    axisTick: {
      show: false
    },
    data: [
      '橘梨纱',
      '美竹铃',
      '天海翼',
      '泷泽萝拉',
      '樱井莉亚',
      '铃原爱蜜莉',
      '铃原爱蜜莉2'
    ],
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
        // type: 'dashed', // dotted 虚线
      }
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    minInterval: 1,
    nameTextStyle: {
      fontSize: 12,
      color: '#BDD8FB',
      align: 'center'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
        // type: 'dashed', // dotted 虚线
      }
    },
    splitArea: { show: false },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      // interval:0,
      color: '#7691b5',
      fontSize: 12
    }
  },
  series: [
    {
      type: 'line',
      symbol: 'none',
      showSymbol: false,
      smooth: true, // 是否曲线
      name: 'rx(Mbps)', // 图例对应类别
      data: [0, 4000, 6000, 7000, 2000, 5000, 7000, 9000], // 纵坐标数据
      areaStyle: {
        // 区域颜色
        // color: new graphic.LinearGradient(0, 0, 0, 1, [
        // 	{
        // 		offset: 0,
        // 		color: "#5090FF",
        // 	},
        // 	{
        // 		offset: 1,
        // 		color: "#1057E5",
        // 	},
        // ]),
        color: {
          type: 'linear',
          x: 0, // 右
          y: 0, // 下
          x2: 0, // 左
          y2: 1, // 上
          colorStops: [
            {
              offset: 0.1,
              color: '#152c52' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(21,45,82, 0)' // 100% 处的颜色
            }
          ]
        }
      }
    },
    {
      type: 'line',
      smooth: true,
      name: 'tx(Mbps)',
      data: [1000, 4000, 5000, 6000, 3000, 8000, 7000],
      areaStyle: {
        // color: new graphic.LinearGradient(0, 0, 0, 1, [
        // 	{
        // 		offset: 0,
        // 		color: "#01B3E4",
        // 	},
        // 	{
        // 		offset: 1,
        // 		color: "#86DCF3",
        // 	},
        // ]),
        color: {
          type: 'linear',
          x: 0, // 右
          y: 0, // 下
          x2: 0, // 左
          y2: 1, // 上
          colorStops: [
            {
              offset: 0.1,
              color: 'rgba(21,45,82, 1)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(21,45,82, 0)' // 100% 处的颜色
            }
          ]
        }
      }
    }
  ]
}
