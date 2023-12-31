import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import '@/assets/less/template.less'
import { ScreenMutations } from '@/store/modules/screen'
import CacheMixin from '../cache'
import * as formItems from '../formItems/index'

export default {
  name: 'DataSourceMixins',
  mixins: [CacheMixin],
  components: {
    ...formItems
  },
  data: () => ({
    formItemLayout: {
      labelCol: {
        span: 6,
        offset: 0
      },
      wrapperCol: {
        span: 15,
        offset: 2
      }
    },
    btnLoading: false
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    dbDataConfig () {
      return this.config.dataConfig.dbDataConfig
    },
    sourceType () {
      return this.config.dataConfig.sourceType
    },
    resourceConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.resourceConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.resourceConfig, v)
        this.change()
      }
    },
    alarmConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.alarmConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.alarmConfig, v)
        this.change()
      }
    },
    overviewConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.overviewConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.overviewConfig, v)
        this.change()
      }
    },
    numberConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.numberConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.numberConfig, v)
        this.change()
      }
    },
    sqlConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.sqlConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.sqlConfig, v)
        this.change()
      }
    },
    ormConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.ormConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.ormConfig, v)
        this.change()
      }
    },
    siteTrafficConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.siteTrafficConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.siteTrafficConfig, v)
        this.change()
      }
    },
    siteCpeConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.siteCpeConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.siteCpeConfig, v)
        this.change()
      }
    },
    plusConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.plusConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.plusConfig, v)
        this.change()
      }
    },
    openConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.openConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.openConfig, v)
        this.change()
      }
    },
    siteCpeStatusConfig: {
      get () {
        return this.config.dataConfig.dbDataConfig.siteCpeStatusConfig
      },
      set (v) {
        Object.assign(this.config.dataConfig.dbDataConfig.siteCpeStatusConfig, v)
        this.change()
      }
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    async change (loadingDynamicData = false) {
      console.log('预览')
      try {
        if (loadingDynamicData) {
          this.btnLoading = true
        }
        const { render, ...rest } = this.activeWidget
        const activeWidget = Object.assign({}, _.cloneDeep(rest), { render })
        // 设置当前选中部件
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
        await this.$nextTick()
        // 此处可能会改变数据，需要再次提交 vuex
        await render.mergeOption(this.config, loadingDynamicData)
        this.activateWidget({
          widget: Object.assign(activeWidget, { config: this.config })
        })
      } catch (e) {
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    async preview () {
      await this.change(true)
    }
  }
}
