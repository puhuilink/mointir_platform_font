<template>
  <div class="boxEcharts">
    <div class="echarts-container" ref="barChart" style="width: 100%; height: 280px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TrafficEcharts',
  data () {
    return {
      img: require('../img/icon1.png')
    }
  },
  mounted () {
    // 获取 DOM 元素
    const barChart = this.$refs.barChart

    // 初始化 ECharts 实例
    const chart = echarts.init(barChart)

    // 图表配置
    const option = {
      backgroundColor: '#100101',
      color: ['#5090FF', '#01B3E4'],
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
              width: 20, // 图标宽度
              height: 20, // 图标高度
              verticalAlign: 'bottom',
              backgroundColor: {
                image: this.img // 图标的背景颜色，这里是图标
              }
            }
          },
          textBorderColor: '#333', // 标题文本的边框颜色
          textBorderWidth: 1, // 标题文本的边框宽度,
          color: '#fff',
          fontSize: 16
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
            color: '#BDD8FB',
            fontSize: 12
          }
        },
        axisLabel: {
          // interval:0,
          color: '#BDD8FB',
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
          fontSize: 12,
          fontFamily: 'Bebas',
          color: '#BDD8FB'
        }
      },
      series: [
        {
          type: 'line',
          symbol: 'none',
          showSymbol: false,
          smooth: true, // 是否曲线
          name: 'rx(Mbps)', // 图例对应类别
          data: [4000, 6000, 7000, 2000, 5000, 7000, 9000], // 纵坐标数据
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
                  color: 'rgba(21,45,82, 1)' // 0% 处的颜色
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

    // 使用配置绘制图表
    chart.setOption(option)
  }
}
</script>

<style scoped>
.boxEcharts{
  background-color: #000000;
  padding: 15px;
}

</style>
