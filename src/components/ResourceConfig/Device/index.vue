<template>
  <div>

    <div class="ComplexSelect">
      <div
        v-show="true"
        class="ComplexSelect__mask"
        @click="onShowAdvancedSelect"
      >

      </div>
      <!--      <a-select-->
      <!--        v-bind="ctx.editAbleProps"-->
      <!--        class="ComplexSelect__select"-->
      <!--        mode="multiple"-->
      <!--        :notFoundContent="fetching ? '加载中' : '暂无数据'"-->
      <!--        placeholder="请输入IP地址、序列号、资产设备标签精准搜索"-->
      <!--        @search="onSearch"-->
      <!--        v-model="selectValue"-->
      <!--      >-->

      <!--        <a-spin v-if="fetching" slot="notFoundContent" size="small" />-->
      <!--        <a-select-option v-for="d in dataList" :key="d.value">-->
      <!--          {{ d.text }}-->
      <!--        </a-select-option>-->
      <!--      </a-select>-->
      <a-input
        v-bind="ctx.editAbleProps"
        class="ComplexSelect__select"
        v-model="selectValue"
      ></a-input>
      <!--      <a-button-->
      <!--        type="link"-->
      <!--        :disabled="false"-->
      <!--        @click="onToggleAdvanced"-->
      <!--      >{{ advanced ? '快速搜索' : '高级分类' }}</a-button>-->
    </div>

    <a-modal
      :afterClose="() => cache = null"
      title="选择监控对象"
      v-model="visible"
      v-if="visible"
      :width="1024"
      wrapClassName="ComplexSelect__modal"
      @cancel="onCancel"
      @ok="onOk"
    >
      <DeviceTypeSelect
        v-bind="ctx.editAbleProps"
        :value="model.deviceType"
        @input="deviceType => {
          if (deviceType == null){
            return
          }
          Object.assign(model, {
            deviceType,
            deviceBrand: null,
            deviceModel: null
          })
        }"
      />

      <DeviceBrandSelect
        v-bind="ctx.editAbleProps"
        :deviceType="model.deviceType"
        :value="model.deviceBrand"
        @input="deviceBrand => {
          if (deviceBrand == null){
            return
          }
          Object.assign(model, {
            deviceBrand,
            deviceModel: null
          })
        }"
      />

      <DeviceModelSelect
        v-bind="ctx.editAbleProps"
        :deviceBrand="model.deviceBrand"
        :value="model.deviceModel"
        @input="deviceModel => {
          if (deviceModel == null){
            return
          }
          Object.assign(model, {
            deviceModel
          })
        }"
      />

      <HostSelect
        v-bind="ctx.editAbleProps"
        :hostTypeDictValueCode="model.deviceModel"
        multiple
        :value="model.hostId"
      />
    </a-modal>

  </div>
</template>

<script>
import _ from 'lodash'
import { ListSelect as DeviceBrandSelect } from '~~~/ResourceConfig/Device/DeviceBrand'
import { ListSelect as DeviceTypeSelect } from './DeviceType'
import { ListSelect as DeviceModelSelect } from './DeviceModel'
import { ListSelect as HostSelect } from '../Host'

export default {
  name: 'ComplexSelect',
  mixins: [],
  inject: {
    ctx: {
      default: () => ({})
    }
  },
  components: {
    DeviceBrandSelect,
    DeviceTypeSelect,
    DeviceModelSelect,
    HostSelect
  },
  props: {
    value: {
      type: Object,
      // default: () => new AlarmRuleModel()
      default: () => ({})
      // required: true
    }
  },
  data: () => ({
    advanced: false,
    cache: null,
    dataList: [],
    fetching: false,
    visible: false
    // selectValue: ''
  }),
  computed: {
    model: {
      get () {
        return this.value
      },
      set (model) {
        this.$emit('input', model)
        // https://www.antdv.com/components/form-model-cn/#API
        // Form.Item 会对唯一子元素进行劫持，并监听 blur 和 change 事件，来达到自动校验的目的
        // 此处自定义组件需要触发 blur 来触发 Form.Item 校验
        this.$emit('blur')
      }
    },
    disabled () {
      // return _.get(this, 'ctx.editAbleProps.disabled')
      return true
    },
    selectValue () {
      let value = ''
      if (this.model.deviceType) {
        value = value.concat(this.model.deviceType)
      }
      if (this.model.deviceBrand) {
        value = value.concat('/' + this.model.deviceBrand)
      }
      if (this.model.deviceModel) {
        value = value.concat('/' + this.model.deviceModel)
      }
      return value === '' ? undefined : value
    }
  },
  methods: {
    onCancel () {
      if (this.cache) {
        Object.assign(this.model, this.cache)
      }
      this.visible = false
    },
    onOk () {
      this.visible = false
    },
    onSearch: _.debounce(async function (e) {
      try {
        this.fetching = true
        this.dataList = []
      } catch (e) {
        this.dataList = []
        throw e
      } finally {
        this.fetching = false
      }
    }, 200),
    onShowAdvancedSelect () {
      if (!this.ctx._data.isEdit) {
        this.visible = true
        this.cache = _.cloneDeep(this.model)
      }
    },
    onToggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less">
.ComplexSelect {

  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  &__select {
    width: 360px !important;
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 360px;
    height: 32px;
  }
}
</style>
