<template>
  <a-form-item label="计算类型">
    <a-select
      allowClear
      class="fw"
      v-model="config.dataConfig.getCurrentConfig().calculateType"
      v-bind="$props"
      v-on="$listeners"
    >
      <a-select-option
        v-for="option in calculateTypeList"
        :key="option.value"
      >{{ option.label }}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Select } from 'ant-design-vue'
import {
  CALCULATE_TYPE_SUM,
  CALCULATE_TYPE_MAX,
  CALCULATE_TYPE_AVG
} from '@/model/config/dataConfig/dynamicData/types/calculate'
import CacheMixin from '../cache'

export default {
  name: 'CalculateTypeSelect',
  mixins: [CacheMixin],
  extends: Select,
  props: {},
  data: () => ({
    calculateTypeList: [
      { label: '求和', value: CALCULATE_TYPE_SUM },
      { label: '最大值', value: CALCULATE_TYPE_MAX },
      { label: '均值', value: CALCULATE_TYPE_AVG }
    ]
  })
}
</script>

<style lang="less">

</style>
