<template>
  <a-modal
    centered
    :title="title"
    :width="570"
    wrapClassName="AlarmRuleDetailSchema__modal"
    v-model="visible"
    :afterClose="reset"
    @ok="cancel"
  >
    <a-spin :spinning="spinning">

      <a-tabs v-model="activeTabKey">
        <a-tab-pane :key="1" tab="基本信息">
          <div class="AlarmRuleDetailSchema__content" v-show="step === 0">
            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">告警规则名称</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.title }}</span>
            </div>

            <!--            <div class="AlarmRuleDetailSchema__item">-->
            <!--              <label class="AlarmRuleDetailSchema__item-label">数据域</label>-->
            <!--              <span class="AlarmRuleDetailSchema__item-value">123</span>-->
            <!--            </div>-->

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">监控类型</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.dictType ? model.dictType.value_label :'暂无数据' }}</span>
            </div>

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">品牌名称</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.deviceBrand }}</span>
            </div>

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">品牌设备</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.deviceModel }}</span>
            </div>

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">设备名称</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.dictBrand ? model.dictBrand.value_label : '暂无数据' }}</span>
            </div>

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">检查实体</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.modelEndpoint ? model.modelEndpoint.alias :'暂无数据' }}</span>
            </div>

            <div class="AlarmRuleDetailSchema__item">
              <label class="AlarmRuleDetailSchema__item-label">检查项</label>
              <span class="AlarmRuleDetailSchema__item-value">{{ model.modelMetric ? model.modelMetric.alias :'暂无数据' }}</span>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane :key="2" tab="规则详情">
          <component
            v-if="component"
            :formModel="model"
            :is="component"
            :isEdit="false"
          />
        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { AlarmRuleService } from '@/api'
import MergeForm from '../AlarmRuleSchema/MergeForm'
import RecoverForm from '../AlarmRuleSchema/RecoverForm'
import UpgradeForm from '../AlarmRuleSchema/UpgradeForm'
import { AlarmRuleModelFactory } from '../AlarmRuleSchema/model'

export default {
  name: 'AlarmRuleDetailSchema',
  mixins: [Schema],
  components: {
    MergeForm,
    RecoverForm,
    UpgradeForm
  },
  props: {},
  data: () => ({
    activeTabKey: 1,
    model: {},
    spinning: false,
    step: 0
  }),
  computed: {
    component () {
      const { ruleType = [] } = this.model
      switch (ruleType[0]) {
        case 'merge': return MergeForm
        case 'recover': return RecoverForm
        case 'upgrade': return UpgradeForm
        default: return null
      }
    }
  },
  methods: {
    detail (id) {
      this.show('查看告警规则')
      this.fetch(id)
    },
    async fetch (id) {
      try {
        this.spinning = true
        const { dictBrand, modelMetric, modelEndpoint, dictType, ...model } = await AlarmRuleService.detail(id)

        // TODO
        AlarmRuleService.devices(id)
        this.model = AlarmRuleModelFactory.create(model)
        Object.assign(this.model, { dictBrand, modelMetric, modelEndpoint, dictType })
      } catch (e) {
        this.model = {}
        throw e
      } finally {
        this.spinning = false
      }
    }
  }
}
</script>

<style lang="less">
.AlarmRuleDetailSchema {
  // &__modal {
  //   .ant-modal-body {
  //     height: 400px;
  //   }
  // }

  &__item {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 8px 4px;

    &-label {
      width: 160px;
      text-align: right;

      &::after {
        content: "：";
      }
    }

    &-value {
      padding-left: 8px;
      flex: 1
    }
  }
}
</style>
