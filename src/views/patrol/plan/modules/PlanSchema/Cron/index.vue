<template>
  <div class="Cron">
    <a-row class="Cron__paragraph">
      <a-form-model-item props="interval">
        <a-radio-group v-model="cron.currentType">
          <!-- / 每天 -->
          <a-radio value="everyDay">每天</a-radio>

          <!-- / 每周  -->
          <a-radio value="dayOfWeek">每周</a-radio>

          <!-- / 每月 -->
          <a-radio value="dayOfMonth">每月</a-radio>
          <!-- <a-radio v-for="{ value, label } in typeList" :key="value" :value="value">{{ label }}</a-radio> -->

          <!-- / 工作日 -->
          <!--          <a-radio value="workDayOfMonth">工作日</a-radio>-->
        </a-radio-group>
      </a-form-model-item>
    </a-row>

    <a-row class="Cron__paragraph" v-show="cron.isDayOfWeek">
      <a-checkbox-group v-model="cron.currentValue">
        <a-checkbox
          v-for="{ value, label } in subTypeList.week"
          :key="value"
          :value="value"
        >{{ label }}</a-checkbox>
      </a-checkbox-group>
    </a-row>

    <a-row class="Cron__paragraph" v-show="cron.isDayOfMonth">
      <a-checkbox-group v-model="cron.currentValue">
        <a-checkbox
          v-for="{ value, label } in subTypeList.month"
          :key="value"
          :value="value"
        >{{ label }}</a-checkbox>
      </a-checkbox-group>
    </a-row>

    <a-row class="Cron__paragraph" v-show="cron.isWorkDayOfMonth">
      第<a-input-number :min="1" :max="30" v-model="cron.currentValue" style="width: 40px"></a-input-number>个工作日
    </a-row>
  </div>
</template>

<script>
import { CronModel } from './CronModel'
const prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

export const cronRule = {
  interval: [
    { required: true, message: '请选择循环周期' }
  ]
}

export default {
  name: 'Cron',
  mixins: [],
  components: {},
  props: {
    cron: {
      type: Object,
      default: () => new CronModel()
    }
  },
  data: () => ({
    typeList: [
      {
        value: 'd',
        label: '每天'
      },
      {
        value: 'w',
        label: '每周'
      },
      {
        value: 'm',
        label: '每月'
      }
    ],
    subTypeList: {
      week: [
        {
          value: 1,
          label: '周日'
        },
        {
          value: 2,
          label: '周一'
        },
        {
          value: 3,
          label: '周二'
        },
        {
          value: 4,
          label: '周三'
        },
        {
          value: 5,
          label: '周四'
        },
        {
          value: 6,
          label: '周五'
        },
        {
          value: 7,
          label: '周六'
        }

      ],
      month: Array(31).fill(null).map((item, idx) => ({ value: idx + 1, label: `${prefixInteger(idx + 1, 2)}` }))
    }
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">
.Cron {
  min-height: 50px;

  &__paragraph {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .ant-checkbox-wrapper {
    margin-left: 8px;
  }
}
</style>
