import DynamicFormItem from '../../../Utils/DynamicFormItem'
import _ from 'lodash'

export default {
  name: 'Common',
  props: {
    // 资源模型属性
    attributeList: {
      type: Array,
      default: () => ([])
    },
    // 资源模型关系属性
    relationAttributeList: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    // ['add', 'edit']
    mode: 'add'
  }),
  computed: {
    baseAttributes () {
      const attributes = [
        ...this.attributeList,
        ...this.relationAttributeList.filter(({ tabGroup }) => tabGroup === 'base')
      ]
      return _.orderBy(attributes, ['order'], 'asc')
    },
    otherAttributes () {
      const attributes = this.relationAttributeList.filter(({ tabGroup }) => tabGroup === 'other')
      return _.orderBy(attributes, ['order'], 'asc')
    },
    relationAttributes () {
      const attributes = this.relationAttributeList.filter(({ tabGroup }) => tabGroup === 'relation')
      return _.orderBy(attributes, ['order'], 'asc')
    },
    title () {
      return this.mode === 'add' ? '新增' : '编辑'
    }
  },
  methods: {
    renderTabPaneBase () {
      const { baseAttributes, renderTabPaneContent } = this
      // TODO: 当 baseAttributes 不包含 name 与 label 时，默认提供这两个 FormItem
      return (
        <a-tab-pane tab="基本信息" key="base" forceRender>
          { renderTabPaneContent(baseAttributes) }
        </a-tab-pane>
      )
    },
    renderTabPaneRelation () {
      const {
        relationAttributes,
        renderTabPaneContent
      } = this
      return _.isEmpty(relationAttributes) ? null : (
        <a-tab-pane tab="关系信息" key="relation" forceRender>
          { renderTabPaneContent(relationAttributes) }
        </a-tab-pane>
      )
    },
    renderTabPaneOther () {
      const {
        otherAttributes,
        renderTabPaneContent
      } = this
      return _.isEmpty(otherAttributes) ? null : (
        <a-tab-pane tab="其他信息" key="other" forceRender>
          { renderTabPaneContent(otherAttributes) }
        </a-tab-pane>
      )
    },
    renderTabPaneContent (fields) {
      const { form, mode, loading } = this
      return (
        <a-row>
          {
            ...fields.map((field, index) => (
              <a-col md={12} span={24} key={index}>
                <DynamicFormItem
                  loading={loading}
                  mode={mode}
                  form={form}
                  field={field} />
              </a-col>
            ))
          }
        </a-row>
      )
    }
  }
}