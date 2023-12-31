import CListSelect from '~~~/ListSelect/CListSelect'
import { DictValueService } from '@/api'
import SelectMixin from '../SelectMixin'

const loadData = (value_parent_code) => DictValueService.find({
  where: {
    value_parent_code
  },
  fields: [
    'key: value_code',
    'label: value_label'
  ],
  alias: 'dataSource'
}).then(r => r.data.dataSource)

const props = {
  deviceType: {
    type: String,
    default: ''
  }
}

const ListSelect = {
  name: 'DeviceBrandListSelect',
  props: {
    ...CListSelect.props,
    ...props
  },
  watch: {
    deviceType: {
      immediate: true,
      async handler (deviceType) {
        await this.$nextTick()
        this.$refs['listSelect'].reset()
        deviceType && this.$refs['listSelect'].refresh(deviceType)
      }
    }
  },
  methods: {
    loadData
  },
  render (h) {
    return h(CListSelect, {
      props: {
        ...this.$props,
        title: '品牌名称',
        data: this.loadData
      },
      on: this.$listeners,
      ref: 'listSelect'
    })
  }
}

const Select = {
  name: 'DeviceBrandSelect',
  mixins: [SelectMixin],
  props: {
    ...props
  },
  watch: {
    deviceType: {
      immediate: true,
      async handler (deviceType) {
        // await this.$nextTick()
        this.list = []
        deviceType && this.fetch(deviceType)
      }
    }
  },
  methods: {
    async fetch (deviceType) {
      try {
        this.loading = true
        this.list = await loadData(deviceType)
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}

export {
  Select,
  ListSelect
}
