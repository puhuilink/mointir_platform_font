<template>
  <div class="boxEcharts">
    <div class="echarts-transverse" ref="transverse" style="width: 100%; height: 360px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TrafficEcharts',
  mounted () {
    // 获取 DOM 元素
    const barChart = this.$refs.transverse

    // 初始化 ECharts 实例
    const chart = echarts.init(barChart)

    // 图表配置
    const option = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter (params) {
          for (const x in params) {
            return params[x].name + ':' + '进度为(' + params[x].data + '%)'
          }
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: [{
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#66CDAA'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: ['项目六', '项目五', '项目四', '项目三', '项目二', '项目一']
      }],
      series: [{
        name: '项目',
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          normal: {
            barBorderRadius: 30,
            color: function (params) {
              // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
              var colorList = ['#DA70D6', '#436EEE', '#61a0a8', '#FFA54F', '#91c7ae', '#749f83', '#ca8622']
              return colorList[params.dataIndex]
            }
          }
        },
        barWidth: 20,
        data: [50, 82, 45, 50, 60, 30]
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: 20,
        barGap: '-100%',
        data: [100, 100, 100, 100, 100, 100],
        itemStyle: {
          normal: {
            color: 'rgba(224,238,238,0.3)',
            barBorderRadius: 30
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
.boxEcharts {
  background-color: #000000;
  /*padding: 0 15px 0 15PX;*/
}

</style>
