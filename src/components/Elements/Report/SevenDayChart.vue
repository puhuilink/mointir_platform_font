<template>
  <div class="outer">
    <!--    横块-->
    <div class="abs block_blue"></div>
    <span class="abs span_7">{{ title }}</span>
    <span class="abs span_6">合计</span>
    <span class="abs span_5" :style="{'color': (type === 'main' ? '#00EDFF': '#FFDA00')}">{{ number }}</span>
    <img src="./img/35.png" class="abs block_image">
    <div class="abs chart_color" ref="chart"></div>
  </div>
</template>

<script>
import _ from 'lodash'
import echarts from 'echarts'
export default {
  name: 'SevenDayChart',
  data () {
    return {
      myChart: null,
      option: {
        color: (this.type === 'main' ? 'rgba(0, 237, 255, 0.7)' : 'rgba(255, 112, 112, 0.7)'),
        xAxis: {
          type: 'category',
          data: this.chartData.map(el => _.get(el, 'collect', '')),
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
            data: this.chartData.map(el => Number(_.get(el, 'total', ''))),
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
                  offset: 0, color: (this.type === 'main' ? 'rgba(0, 237, 255, 0.7)' : 'rgba(255, 112, 112, 0.7)') // 0% 处的颜色
                }, {
                  offset: 1, color: (this.type === 'main' ? 'rgba(0, 237, 255, 0)' : 'rgba(255, 112, 112, 0)') // 100% 处的颜色
                }]
              }
            }
          }
        ]
      }
    }
  },
  props: {
    title: {
      default: '过去7天主告警'
    },
    type: {
      default: 'main'
    },
    number: {
      default: '0'
    },
    chartData: {
      type: Array,
      default: () => [
        {
          collect: '2023-10-17',
          total: '894'
        },
        {
          collect: '2023-10-18',
          total: '2368'
        },
        {
          collect: '2023-10-19',
          total: '1988'
        },
        {
          collect: '2023-10-20',
          total: '1732'
        },
        {
          collect: '2023-10-21',
          total: '1620'
        },
        {
          collect: '2023-10-22',
          total: '1623'
        },
        {
          collect: '2023-10-23',
          total: '2902'
        }
      ]
    }
  },
  methods: {
    load (option) {
      this.myChart = echarts.init(this.$refs.chart)
      this.myChart.setOption(option)
      console.log('option', this.option, this.chartData.map(el => _.get(el, 'collect', '')), this.chartData.map(el => Number(_.get(el, 'total', ''))))
    },
    setOption () {
      this.myChart.setOption(this.option)
    }
  },
  mounted () {
    this.load()
  }
}
</script>

<style scoped>
.outer {
  width: 696px;
  height: 174px;
  background: linear-gradient(360deg, rgba(33,82,139,0.49) 0%, rgba(21,47,87,0) 100%);
  position: relative;
}
.abs {
  position: absolute;
}
.block_blue {
  width: 5px;
  height: 20px;
  background: #00F9FF;
  left: 27px;
  top:18px;
}
.span_7 {
  width: 150px;
  height: 16px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 16px;
  left: 49px;
  top: 20px;
}

.span_6 {
  width: 28px;
  height: 14px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #B3EFFF;
  line-height: 14px;
  left: 74px;
  top: 80px;
}

.span_5 {
  width: 88px;
  height: 30px;
  font-size: 24px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: #00EDFF;
  line-height: 30px;
  left: 46px;
  top: 50px;
  text-align: center;
}
.chart_color {
  width: 484px;
  height: 112px;
  left: 177px;
  top: 30px;
  /*background-color: #fff;*/
}
.block_image {
  left: 50px;
  top: 78px;
}
</style>
