<template>
  <a-modal
    title="查看排班"
    :width="800"
    :visible="visible"
    :loading="loading"
    centered
    @cancel="onCancel"
  >
    <template #footer>
      <a-button @click="onCancel">取消</a-button>
    </template>
    <div class="cal">
      <a-calendar
        :validRange="[startTime, endTime]"
      >
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getListData(value)" :key="item.content" style="list-style: none">
            <a-popover trigger="hover">
              <a-badge :status="item.type" :text="item.content" />
              <template #content>
                {{ item.title }}
              </template>
            </a-popover>
          </li>
        </ul>
      </a-calendar>
    </div>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import moment from 'moment'
import { alarm } from '@/utils/request'
import _ from 'lodash'

export default {
  name: 'DetailSchema',
  mixins: [Schema],
  data () {
    return {
      loading: false,
      startTime: moment().startOf('month'),
      endTime: moment().endOf('month'),
      task: [],
      schedule: {}
    }
  },
  methods: {
    moment,
    getListData (value) {
      const arr = []
      if (this.judgeTime(value, this.startTime, this.endTime)) {
        if (this.schedule.dataType === 'day') {
          this.schedule.remarks.map(el => arr.push({ type: 'success', content: el.account.split('|||||||||')[0], title: `${moment(el.startTime).format('HH:mm')}~${moment(el.endTime).format('HH:mm')}` }))
        } else {
          this.schedule.remarks.map(el => {
            if (el.weekNumber.includes(Number(value.format('d')))) {
              // console.log(el.weekNumber, Number(value.format('d')))
              arr.push({ type: 'success', content: el.account.split('|||||||||')[0], title: `${moment(el.startTime).format('HH:mm')}~${moment(el.endTime).format('HH:mm')}` })
            }
          })
        }
      }
      return arr
    },
    async onShow (id) {
      try {
        this.loading = true
        const { data: { task, schedule } } = await alarm.post('/api/configuration/schedule/detail', { id: id })
        if (task === null) {
          this.$message.error('该计划下无可排班日期')
        } else {
          this.visible = true
          this.startTime = moment(_.get(schedule, 'effectiveTime', ''))
          this.endTime = moment(_.get(schedule, 'expireTime', ''))
          this.task = task
          this.schedule = schedule
        }
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    onCancel () {
      this.visible = false
    },
    judgeTime (time, front, back) {
      if (moment.isMoment(time)) {
        return time.diff(front, 'hour') >= 0 && back.diff(time, 'day') >= 0
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>
