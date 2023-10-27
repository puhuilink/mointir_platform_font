<template>
  <div class="border">
    <a-row :gutter="[24,16]">
      <a-col :span="24">
        <img src="./img/大标题.png" class="biaoti">
      </a-col>
    </a-row>
    <div class="abs" style="top: 90px;left: 20px;">
      <cir :number="mainAlarm"></cir>
    </div>

    <div class="abs" style="top: 90px;left: 252px;">
      <cir :number="allAlarm" type="all"></cir>
    </div>

    <div class="abs" style="top: 90px;left: 488px;">
      <seven :number="past7Alarm" ref="mainAlarm"></seven>
    </div>

    <div class="abs" style="top: 90px;left: 1204px;">
      <seven title="过去7天所有告警" :number="post7AllAlarm" type="all" ref="allAlarm" :chart-data="past7AllList"></seven>
    </div>

    <!--    告警设备类型统计-->
    <div class="abs" style="top: 290px;left: 20px;">
      <tit name="告警设备类型统计"></tit>
      <!--      <a-range-picker format="YYYY/MM/DD HH:mm" @change="levelAlarm" class="abs rangePickerIceGai" style="width: 100px;height: 28px;left: 550px;top: 5px;">-->
      <!--        <a-icon slot="suffixIcon" type="calendar"/>-->
      <!--      </a-range-picker>-->
      <a-select v-model="deviceValue" class="abs rangePickerIceGai" style="width: 100px;height: 28px;left: 550px;top: 5px;">
        <a-select-option v-for="(item) in alarmTypeList" :value="item.id" :key="item.id" >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-range-picker format="YYYY/MM/DD HH:mm" v-model="deviceTimeList" class="abs rangePickerIceGai" style="width: 234px;height: 28px;left: 684px;top: 5px;">
        <a-icon slot="suffixIcon" type="calendar"/>
      </a-range-picker>
      <AlarmStatistics :option="pieData" ref="pie"></AlarmStatistics>
    </div>

    <!--    接入平台-->
    <div class="abs" style="top: 290px;left: 970px;">
      <tit></tit>
      <color>
        <span style="color: #00F9FF;top: 400px;left: 100px;" class="abs"></span>
      </color>
    </div>

    <!--    告警处置统计-->
    <div class="abs" style="top: 687px;left: 20px;">
      <tit name="告警处置统计"></tit>
      <a-range-picker format="YYYY/MM/DD HH:mm" @change="levelAlarm" class="abs rangePickerIceGai" style="width: 234px;height: 28px;left: 684px;top: 5px;">
        <a-icon slot="suffixIcon" type="calendar"/>
      </a-range-picker>
      <AlarmStatistics :option="dealStatics" ref="deal"></AlarmStatistics>
    </div>

    <!--    告警分级统计-->
    <div class="abs" style="top: 687px;left: 970px;">
      <tit name="告警分级统计"></tit>
      <a-range-picker format="YYYY/MM/DD HH:mm" @change="dealAlarm" class="abs rangePickerIceGai" style="width: 234px;height: 28px;left: 684px;top: 5px;">
        <a-icon slot="suffixIcon" type="calendar"/>
      </a-range-picker>
      <AlarmStatistics :option="peizhi" ref="statistics"></AlarmStatistics>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import cir from '~~~/Elements/Report/circle'
import seven from '~~~/Elements/Report/SevenDayChart'
import tit from '~~~/Elements/Report/title'
import color from '~~~/Elements/Report/ColorMask'
import AlarmStatistics from '~~~/Elements/Report/AlarmStatistics'
import { sql } from '@/utils/request'
import {
  alarmTotalType,
  currentAlarm,
  currentMainAlarm, gradedStatistics, handlingAlarm, handlingAvgClaimTime, handlingAvgTime, past7DaysAllAlarm,
  past7DaysMainAlarm,
  pastAllSevenDayAlarm,
  pastSevenDayAlarm,
  pieDataSql
} from '~~~/Elements/Report/sql'
import { dealQuery, sqlResultDealer } from '@/utils/util'
import { dealStatics, pass7DayAllAlarmData, peizhi, pieData } from '../defaultData'
export default {
  name: 'ReportPreviewElement',
  components: { cir, seven, tit, color, AlarmStatistics },
  data () {
    return {
      pieData,
      peizhi,
      dealStatics,
      mainAlarm: 0,
      allAlarm: 0,
      past7Alarm: 0,
      post7AllAlarm: 0,
      past7MainList: [],
      past7AllList: [],
      alarmTypeList: [],
      deviceValue: '401040996177154049',
      deviceTimeList: []
    }
  },
  methods: {
    async loadTodayMain () {
      const res = dealQuery(await sql(currentAlarm))
      this.mainAlarm = _.get(res, '0.total', 0)
      const res_all = dealQuery(await sql(currentMainAlarm))
      this.allAlarm = _.get(res_all, '0.total', 0)
      const res_7_main = dealQuery(await sql(pastSevenDayAlarm))
      this.past7Alarm = _.get(res_7_main, '0.total', 0)
      const res_7_all = dealQuery(await sql(pastAllSevenDayAlarm))
      this.post7AllAlarm = _.get(res_7_all, '0.total', 0)
      const res_7_main_list = sqlResultDealer(await sql(past7DaysMainAlarm))
      this.past7MainList = res_7_main_list
      this.$refs.mainAlarm.load(pass7DayAllAlarmData(res_7_main_list, 'main'))
      const res_7_all_list = sqlResultDealer(await sql(past7DaysAllAlarm))
      this.past7AllList = res
      this.$refs.allAlarm.load(pass7DayAllAlarmData(res_7_all_list, 'All'))
      await this.alarmTypeTotal()
    },
    // 告警类型统计
    async alarmTypeTotal (val = '401040996177154049', timeList = []) {
      const option = sqlResultDealer(await sql(alarmTotalType))
      this.alarmTypeList = option
      const pieOption = sqlResultDealer(await sql(pieDataSql(val, timeList)))
      if (_.isEmpty(pieOption)) {
        this.pieData.title.subtext = ''
        this.pieData.series[0].data = []
        this.pieData.graphic[0].invisible = false
        this.$refs.pie.load(this.pieData)
      } else {
        this.pieData.graphic[0].invisible = true
        const name = this.alarmTypeList.filter(el => el.id === val)[0].name
        this.pieData.series[0].name = name
        this.pieData.title.subtext = name
        this.pieData.series[0].data = pieOption
        this.$refs.pie.load(this.pieData)
      }
    },
    // 告警类型统计变化
    async alarmTypeChange () {

    },
    // 告警处置统计
    async levelAlarm (dates, dateStrings) {
      const hanglingRate = dealQuery(await sql(handlingAvgTime(dateStrings)))
      const claimHour = dealQuery(await sql(handlingAvgClaimTime(dateStrings)))
      const handingHour = dealQuery(await sql(handlingAlarm(dateStrings)))
      this.dealStatics.xAxis.data = handingHour.map(el => el.name)
      // 告警数量
      this.dealStatics.series[0].data = handingHour.map(el => _.get(el, 'alert_count', 0))
      this.dealStatics.series[1].data = handingHour.map(el => _.get(el, 'process_count', 0))
      this.dealStatics.series[2].data = handingHour.map(el => _.get(el, 'avg_process_rate', 0))
      this.$refs.deal.setOption()
    },
    // 告警分级统计
    async dealAlarm (dates, dateStrings) {
      const res = dealQuery(await sql(gradedStatistics))
      this.peizhi.xAxis.data = res.map(el => el.name)
      // 告警数量
      this.dealStatics.series[0].data = res.map(el => _.get(el, 'alert_count', 0))
      this.dealStatics.series[1].data = res.map(el => _.get(el, 'process_count', 0))
      this.dealStatics.series[2].data = res.map(el => _.get(el, 'avg_process_rate', 0))
      this.$refs.statistics.setOption()
    }
  },
  mounted () {
    this.loadTodayMain()
  },
  watch: {
    deviceValue (val) {
      this.alarmTypeTotal(val, this.deviceTimeList)
    },
    deviceTimeList (val) {
      this.alarmTypeTotal(this.deviceValue, this.deviceTimeList)
    }
  }
}
</script>

<style>
.rangePickerIceGai {
  background: #2877BF;
  color: #4d5157;
}
.border {
  background-color: #152F57;
  height: 1080px;
  width: 1920px;
  opacity: 100%;
  position: relative;
}
.abs {
  position: absolute;
}

.biaoti {
  width: 1869px;
  height: 62px;
  margin-left: 18px;
  border: 2px solid;
}
</style>
