<template>
  <div class="boxEcharts">
    <div class="echarts-container" ref="barChart" style="width: 100%; height: 280px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TrafficEcharts',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      img: require('../img/icon1.png')
    }
  },
  methods: {
    setOption (origin = {}) {
      const barChart = this.$refs.barChart
      const chart = echarts.init(barChart)
      chart.setOption(origin || this.option)
    }
  },
  mounted () {
    this.setOption()
  }
}
</script>

<style scoped>
.boxEcharts{
  background-color: #000000;
  padding: 15px;
}

</style>
