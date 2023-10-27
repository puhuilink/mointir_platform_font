<template>
  <div class="outer" ref="chart">
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'AlarmStatistics',
  props: {
    option: {
      default: () => {
        return {
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
              name: 'Direct',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'Email',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },

            {
              name: 'Baidu',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            }
          ]
        }
      }
    }
  },
  data () {
    return {
      myChart: null
    }
  },
  methods: {
    load (option = []) {
      this.myChart = echarts.init(this.$refs.chart)
      if (option.length === 0) {
        this.setOption()
      } else {
        this.myChart.setOption(option)
      }
    },
    setOption () {
      this.myChart.setOption(this.option)
    }
  },
  watch: {
    option: (val) => {
      console.log('改变了', val)
    }
  },
  mounted () {
    this.load()
  }
}
</script>

<style scoped>
.outer {
  width: 930px;
  height: 328px;
  background: linear-gradient(360deg, rgba(33,82,139,0.49) 0%, rgba(21,47,87,0) 100%);
  position: relative;
}
</style>
