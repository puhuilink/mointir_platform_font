<template>
  <div class="boxEcharts-earth">
    <div class="echarts-earth" ref="barChart" style="width: 100%; height:630px;"></div>
    <div class="textBox">
      <a-row type="flex" justify="space-between" class="a-row0">
        <div class="row0-1">
          <div class="row0-1-text">Topology</div>
          <div class="row0-1-text-number">231</div>
          <div class="row0-1-text">Total</div>
        </div>
        <div class="row0-1">
          <div class="row0-1-text">Topology</div>
          <div class="row0-1-text-number">231</div>
          <div class="row0-1-text">Total</div>
        </div>
        <div class="row0-1">
          <div class="row0-1-text">Topology</div>
          <div class="row0-1-text-number">231</div>
          <div class="row0-1-text">Total</div>
        </div>
        <div class="row0-1">
          <div class="row0-1-text">Topology</div>
          <div class="row0-1-text-number">231</div>
          <div class="row0-1-text">Total</div>
        </div>
        <div class="row0-2">
          <div class="row0-2-text">Bandwidth</div>
          <div class="row0-2-Gbps">
            <div class="row0-2-1">
              <div class="row0-1-text">Rx：55.1 Gbps</div>
              <div class="row0-1-text">Tx：55.1 Gbps</div>
              <div class="row0-1-text">Total</div>
            </div>
            <div class="row0-2-2">
              <div class="row0-1-text">Rx：55.1 Gbps</div>
              <div class="row0-1-text">Tx：55.1 Gbps</div>
              <div class="row0-1-text">Subscription</div>
            </div>
          </div>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { defaultOption } from '~~~/Elements/SDMap/MapData'

export default {
  name: 'EarthEcharts',
  data () {
    return {
      defaultOption
    }
  },
  mounted () {
    // 获取 DOM 元素
    const barChart = this.$refs.barChart

    // 初始化 ECharts 实例
    const chart = echarts.init(barChart)

    // 发光的小圈的经纬度，数组的话就是该经纬度的小圈使用默认样式，对象可自定义样式

    var point_circle = [
      {
        value: [109.754859, 19.189767],
        label: {
          name: '海口市'
        },
        itemStyle: {
          color: 'red'
        }
      },
      {
        value: [116.41995, 40.18994],
        label: {
          name: '北京市'
        }
      },
      {
        value: [85.294711, 41.371801],
        label: {
          name: '乌鲁木齐市'
        }
      },
      {
        value: [110.3467, 41.4899],
        label: {
          name: '呼和浩特市'
        }
      },
      {
        value: [125.8154, 44.2584],
        label: {
          name: '长春市'
        }
      },
      {
        value: [114.4995, 38.1006],
        label: {
          name: '石家庄市'
        }
      },
      {
        value: [117.4219, 39.4189],
        label: {
          name: '天津市'
        }
      },
      {
        value: [106.3586, 38.1775],
        label: {
          name: '银川市'
        }
      },
      {
        value: [103.5901, 36.3043],
        label: {
          name: '兰州市'
        }
      },
      {
        value: [119.4543, 25.9222],
        label: {
          name: '福州市'
        }
      }
    ]

    // 流向线条的经纬度，可自定义样式
    var point_line = [
      {
        coords: [
          [109.754859, 19.189767], // 初始点经纬度
          [116.41995, 40.18994] // 目标点经纬度
        ],
        label: {
          start: '海口',
          end: '北京'
        }
      },
      {
        coords: [
          [109.754859, 19.189767],
          [85.294711, 41.371801]
        ],
        label: {
          start: '海口',
          end: '乌鲁木齐'
        }
      },
      {
        coords: [
          [110.3467, 41.4899],
          [109.754859, 19.189767]
        ],
        lineStyle: { // 自定样样式
          color: '#52b9c7'
        },
        label: {
          start: '呼和浩特',
          end: '海口'
        }
      },
      {
        coords: [
          [125.8154, 44.2584],
          [103.5901, 36.3043]
        ],
        lineStyle: {
          color: '#5abead'
        },
        label: {
          start: '长春',
          end: '兰州'
        }
      },
      {
        coords: [
          [119.4543, 25.9222],
          [103.5901, 36.3043]
        ],
        label: {
          start: '福州',
          end: '兰州'
        }
      },
      {
        coords: [
          [106.3586, 38.1775],
          [119.4543, 25.9222]
        ],
        label: {
          start: '银川',
          end: '福州'
        }
      },
      {
        coords: [
          [114.4995, 38.1006],
          [119.4543, 25.9222]
        ],
        label: {
          start: '石家庄',
          end: '福州'
        }
      },
      {
        coords: [
          [117.4219, 39.4189],
          [109.754859, 19.189767]
        ],
        label: {
          start: '天津',
          end: '海口'
        }
      }
    ]
    // 图表配置
    const option = {
      //  tooltip 该版本需在 option中定义才开启
      //  子图层可自定义内容
      tooltip: {
        // 格式化内容，返回为空，地图组件不起作用，得在地图组件重新定义
        formatter: () => '',
        textStyle: {
          color: '#fff'
        }
      },
      backgroundColor: '#013954',
      geo: {
        map: 'worldAndChina',
        zoom: 1.1,
        roam: true,
        layoutCenter: ['50%', '50%'],
        // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
        layoutSize: '100%',
        itemStyle: {
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
              }
            ]
          },
          shadowColor: 'rgba(128, 217, 248, 1)',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10,
          borderColor: 'rgba(147, 235, 248, 1)'
        },
        tooltip: {
          formatter: () => ''
        },
        emphasis: { // 地图高亮
          itemStyle: {
            color: '#93EBF8'
          }
        }
      },
      series: [
        {
          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            symbolSize: 5,
            color: '#E4AA0C',
            symbol: 'arrow'
          },
          lineStyle: {
            color: '#F56828',
            width: 1, // 线条宽度
            curveness: 0.3
          },
          tooltip: {
            formatter ({ data }) {
              return `流向走向如下：<br />
              起点：${data.label.start}<br />
              终点：${data.label.end}
              `
            },
            backgroundColor: 'rgba(245,108,45,0.5)'
          },
          data: point_line
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          rippleEffect: {
            number: 2,
            scale: 3,
            brushType: 'stroke'
          },
          itemStyle: {
            color: '#F56828'
          },
          tooltip: {
            formatter ({ data }) {
              return `地点位于：${data.label.name}`
            },
            backgroundColor: 'rgba(232,85,160,0.5)'
          },
          label: {
            show: true,
            offset: [40, 0],
            color: '#F56828',
            formatter ({ data }) {
              return `${data.label.name}`
            }
          },
          data: point_circle
        } // 地图线的动画效果,
      ]
    }

    // 使用配置绘制图表
    chart.setOption(option)
  }
}
</script>

<style scoped lang="less">
.boxEcharts-earth {
  height: 100%;
  background-color: rgb(24, 24, 24);
}

.echarts-earth {
  position: relative;
}

.textBox {
  width: 100%;
  height: 110px;
  position: absolute;
  bottom: 0px;
  left: 0px
}

.a-row0 {
  height: 100px;
  padding: 0 20px;

  .row0-1 {
    width: 14%;
    color: #FFFFFF;
    border-radius: 5px;
    background-color: rgb(28, 32, 34);
    padding: 5px 0;

    .row0-1-text {
      font-size: 14px;
      line-height: 180%;
      text-align: center;
    }

    .row0-1-text-number {
      font-size: 20px;
      line-height: 200%;
      text-align: center;
    }
  }

  .row0-2 {
    width: 34%;
    color: #FFFFFF;
    border-radius: 5px;
    background-color: rgb(28, 32, 34);
    padding: 5px 0px 5px 20px;

    .row0-2-text {
      font-size: 14px;
      line-height: 200%;
    }

    .row0-2-Gbps {
      width: 100%;
      display: flex;

      .row0-2-1 {
        width: 50%;

      }

      .row0-2-2 {
        width: 50%;

      }
    }

  }
}
</style>
