<template>
  <div class="AlarmStatus__badge_group">
    <!--    <div class="AlarmStatus__badge_item">-->
    <!--      <a-icon v-bind="badgeProps(5)" />-->
    <!--      <span>正常</span>-->
    <!--    </div>-->
    <div
      class="AlarmStatus__badge_item"
      v-for="(index) in levelList"
      :key="index"
      @click="onToggleIndex(index)"
    >
      <a-icon
        theme="filled"
        type="flag"
        :style="{
          color: alarmList.includes(index) ? colors.get(index) : 'rgba(0,0,0,.5 )'
        }"/>
      {{ fontColors.get(index) }}
    </div>
  </div>
</template>

<script>
import { pureLevelColorMapping, fontPureLevelColorMapping } from '@/components/Alarm/color.config'
import _ from 'lodash'

export default {
  name: 'AlarmStatusBadgeGroup',
  mixins: [],
  components: {},
  data () {
    return {
      levelList: [...pureLevelColorMapping.keys()],
      colors: pureLevelColorMapping,
      fontColors: fontPureLevelColorMapping,
      alarmList: [1, 2, 3, 4, 6]
    }
  },
  computed: {},
  methods: {
    onToggleIndex (alarmLevel) {
      const index = this.alarmList.indexOf(alarmLevel)
      if (index === -1) {
        this.alarmList.push(alarmLevel)
      } else if (this.alarmList.length > 1) {
        this.alarmList.splice(index === 5 ? 6 : index, 1)
      }
      this.alarmList = _.uniq(this.alarmList)
      this.$emit('alarmSend', this.alarmList)
    }
  }
}
</script>

<style lang="less">
.AlarmStatus {
  &__badge_group {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  &__badge_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    padding: 2px;
  }
}
</style>
