/**
* 配置模板
* Author: dong xing
* Date: 2019/11/13
* Time: 1:44 下午
* Email: dong.xing@outlook.com
*/
<template>
  <div class="config">
    <div class="config__header">
      <p>窗口配置</p>
    </div>
    <div class="config__content">
      <div class="comment-template" v-if="activeWidget">
        <div class="comment-template__header" v-if="hasCommonTitle">
          <p class="comment-template__name">{{ templateName }}</p>
          <a-popconfirm
            title="从视图中删除该部件?"
            placement="left"
            @confirm="() => removeWidget({ widgetId: activeWidget.widgetId })"
            okText="确定"
            cancelText="取消"
          >
            <a-button shape="circle" type="danger" icon="delete" />
          </a-popconfirm>
        </div>
        <keep-alive :include="includeTemplateNameList">
          <component :is="templateComponentName" />
        </keep-alive>
      </div>
      <div class="config__none" v-else>
        <a-icon type="disconnect" />
        <p>无激活窗口配置</p>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import CONFIG_COMPONENTS from './configComponents'
import TEMPLATES from '../template/templates'
import _ from 'lodash'

export default {
  name: 'Config',
  components: {
    ...CONFIG_COMPONENTS
  },
  data: () => ({
    // todo 之后更改命名，使其更加语义化: ['line', 'LineConfig']
    // 添加海外sdw：0：加载左侧Hwsdw
    templateMapping: new Map([
      ['Bar', 'Bar'],
      ['Lines', 'Lines'],
      ['Texts', 'Texts'],
      ['Rect', 'Rects'],
      ['Circle', 'CircleConfig'],
      ['Triangle', 'TriangleConfig'],
      ['Topology', 'Topology'],
      ['Clock', 'Clock'],
      ['Image', 'ImageConfig'],
      ['View', 'ViewConfig'],
      ['Gauge', 'Gauge'],
      ['DegreeRing', 'DegreeRingConfig'],
      ['AlarmList', 'AlarmListConfig'],
      ['TextHealth', 'TextHealthConfig'],
      ['List', 'ListConfig'],
      ['Pie', 'PieConfig'],
      ['Polar', 'PolarConfig'],
      ['UPS', 'UpsConfig'],
      ['Global', 'GlobalConfig'],
      ['Select', 'SelectConfig'],
      ['UPS', 'UpsConfig'],
      ['Tab', 'TabConfig'],
      ['NewAlarm', 'NewAlarmConfig'],
      ['More', 'MoreConfig'],
      ['SDMap', 'SDMapConfig'],
      ['Percent', 'PercentConfig'],
      ['ToLine', 'ToLineConfig'],
      ['Department', 'DepartmentConfig'],
      ['TimeSelector', 'TimeSelectorConfig'],
      ['Hwsdw', 'Hwsdw']
    ])
  }),
  computed: {
    ...mapState('screen', ['activeWidget', 'view']),
    ...mapGetters('screen', ['widgets']),
    templateName () {
      const template = TEMPLATES.find(template => template.type === this.activeWidget.config.type)
      return template ? template.name : '画板'
    },
    hasCommonTitle () {
      return this.activeWidget.config.type !== 'Topology'
    },
    templateComponentName () {
      return this.templateMapping.get(this.activeWidget.config.type)
    },
    templateComponentKey () {
      return this.activeWidget.widgetId
    },
    // 缓存的配置组件
    includeTemplateNameList () {
      return _.uniq([
        ...this.view.widgets.map(({ config }) => this.templateMapping.get(config.type)),
        'ViewConfig'
      ])
    }
  },
  methods: {
    ...mapMutations('screen', {
      removeWidget: ScreenMutations.REMOVE_WIDGET
    })
  }
}
</script>

<style scoped lang="less">
.config {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-content: stretch;
  width: 320px;
  height: 100%;

  &__header {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    box-sizing: border-box;
    padding: 0 16px;
    box-shadow: 0 2px 8px #f0f1f2;
    z-index: 3;

    p {
      flex: none;
      margin: 0;
    }
  }

  &__content {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-shadow: -4px 8px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 2;
  }

  &__none {
    width: 100%;
    text-align: center;

    i {
      color: rgba(0, 0, 0, 0.56);
      font-size: 36px;
      margin-bottom: 16px;
    }
  }
}
</style>
