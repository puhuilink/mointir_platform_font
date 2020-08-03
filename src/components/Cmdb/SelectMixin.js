import { filterOption } from '@/utils/util'

export default {
  name: 'SelectMixin',
  props: {
    value: {},
    toolTip: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: [Number, String],
      default: ''
    }
  },
  data: () => ({
    list: [],
    loading: false
  }),
  // TODO: select watch emit empty event
  computed: {
    selectProps () {
      const {
        loading,
        multiple,
        onChange = () => {}
      } = this
      return {
        allowClear: true,
        filterOption,
        maxTagCount: 5,
        mode: multiple ? 'multiple' : 'default',
        notFoundContent: loading ? '加载中...' : '暂无数据',
        onChange,
        showSearch: true,
        style: { minWidth: '175px' }
      }
    },
    tooltipTitle () {
      // TODO
      // const { list, toolTip } = this
      return ''
    }
  },
  watch: {
    parentId: {
      immediate: true,
      async handler (parentId) {
        this.list = []
        parentId && await this.fetch(parentId)
      }
    }
  },
  methods: {
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    fetch (parentId) {},
    change (e) {
      this.$emit('change', e)
      this.$emit('update:value', e)
    },
    renderSelect () {
      return (
        <a-select {...{ props: this.selectProps }} value={this.value} onChange={this.change}>
          { ...this.renderSelectOption() }
        </a-select>
      )
    },
    renderSelectOption () {
      return this.list.map(({ key, label }) => (
        <a-select-option key={key} value={key}>
          { label }
        </a-select-option>
      ))
    },
    renderToolTip () {
      this.$createElement('p', {
        domProps: { innerHTML: this.tooltipTitle },
        slot: 'title'
      })
    }
  },
  render (h) {
    const { renderSelect, toolTip, tooltipTitle } = this
    const withoutToolTip = renderSelect()
    const withTooltip = (
      <a-tooltip placement="leftTop" title={tooltipTitle}>
        { withoutToolTip }
      </a-tooltip>
    )
    return (
      <div className="SelectMixin">
        { toolTip ? withTooltip : withoutToolTip }
      </div>
    )
  }
}