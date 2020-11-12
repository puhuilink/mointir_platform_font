<template>
  <a-modal
    centered
    :title="title"
    :width="920"
    wrapClassName="HistoryChart__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="确定"
    @ok="cancel"
  >
    <a-spin :spinning="spinning">

      <!-- / query -->
      <a-form layout="inline" class="HistoryChart__form">
        <a-form-item label="采集时间" class="fw">
          <a-range-picker
            class="fw"
            :disabledDate="current => current && current > moment().endOf('day')"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            :ranges="{
              '最近1天': [moment().add(-1, 'days'), moment(), moment()],
              '最近1周': [moment().add(-7, 'days'), moment()],
              '最近1月': [moment().add(-30, 'days'), moment()]
            }"
            :showTime="{ format: 'HH:mm' }"
            v-model="queryParams.collect_time"
            @ok="fetch"
          />
        </a-form-item>
      </a-form>

      <!-- / echarts -->
      <figure class="HistoryChart__chart" ref="chart"></figure>

    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import moment from 'moment'
import { generateQuery } from '@/utils/graphql'
import { MetricService } from '@/api'
import _ from 'lodash'
import echarts from 'echarts'

export default {
  name: 'HistoryChart',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    $chart: null,
    // host endpoint metric list
    hEMList: [],
    queryParams: {
      'collect_time': [
        moment().add(-1, 'hours').add(-2, 'days'),
        moment().add(-2, 'days')
      ]
    },
    spinning: false
  }),
  computed: {
    modalTitle () {
      const [item = {}] = this.hEMList
      const { host_alias = '', endpoint_alias = '' } = item
      return `${host_alias}-${endpoint_alias}历史图`
    },
    metricAliasMapping () {
      return new Map(
        this.hEMList.map(({ metric_alias, metric_id }) => [metric_id, metric_alias])
      )
    }
  },
  methods: {
    moment,
    showHistory ({ children = [] }) {
      this.hEMList = children
      this.show(this.modalTitle)
      this.fetch()
      this.initChart()
    },
    async fetch () {
      if (_.isEmpty(this.queryParams.collect_time)) {
        return
      }

      try {
        this.spinning = true
        const { data } = await MetricService.batchFind(
          this.hEMList.map((child, index) => ({
            where: generateQuery({
              ...this.queryParams,
              ..._.pick(child, ['host_id', 'endpoint_id', 'metric_ic'])
            }),
            fields: ['metric_value', 'collect_time'],
            alias: `metric_${child.metric_id}`
          }))
        )

        const series = Object
          .entries(data)
          .map(([key, value]) => {
            const metric_id = Number(_.last(key.split('metric_')))
            const valueList = value.map(({ metric_value, collect_time }) => (
              [moment(collect_time).format(), metric_value]
            ))
            return {
              name: this.metricAliasMapping.get(metric_id),
              type: 'line',
              stack: true,
              smooth: true,
              // 同一秒内可能有多次采集
              data: _.uniqBy(valueList, el => el[0])
            }
          })

        this.setChartOptions({ series })
      } catch (e) {
        throw e
      } finally {
        this.spinning = false
      }
    },
    initChart () {
      setTimeout(() => {
        this.$chart = echarts.init(this.$refs['chart'], '', { renderer: 'canvas' })
        this.setChartOptions()
      })
    },
    setChartOptions (options = {}) {
      this.$chart.clear()
      this.$chart.setOption(Object.assign({}, {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        legend: {
          data: [...this.metricAliasMapping.values()]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          data: []
        },
        yAxis: { type: 'value' },
        series: []
      }, options))
    }
  }
}
</script>

<style lang="less">
.HistoryChart {
  &__chart {
    width: 100%;
    height: 600px;
  }
}
</style>