/**
* 拓扑配置
* Author: dong xing
* Date: 2020/1/13
* Time: 4:12 下午
* Email: dong.xing@outlook.com
*/

<template>
  <div class="comment-template">
    <div class="comment-template__header">
      <p class="comment-template__name">拓扑图</p>
      <a-popconfirm
        title="从视图中删除该部件?"
        placement="left"
        @confirm="remove"
        okText="提交"
        cancelText="取消"
      >
        <a-button shape="circle" type="danger" icon="delete" />
      </a-popconfirm>
    </div>
    <div class="topology-config">
      <a-tabs
        defaultActiveKey="1"
        tabPosition="top"
        :style="{ height: '100%'}"
      >
        <a-tab-pane tab="样式" key="1">

          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 公共配置模板 -->
            <CommonTemplate :usePadding="false" />
            <!-- E 公共配置模板 -->

          </a-collapse>

        </a-tab-pane>

        <a-tab-pane tab="属性" key="2">

          <div class="topology-config__template">

            <a-collapse :activeKey="activePanel" :bordered="false">

              <!-- S 操作 -->
              <a-collapse-panel header="操作" key="1">

                <div class="comment-template__item">
                  <p class="comment-template__leading">编辑:</p>
                  <div class="comment-template__inner topology-config__editable">
                    <a-switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      :checked="topologyEditable"
                      @change="topologyEdit" />
                  </div>
                </div>
                <!-- / 编辑 -->

                <div v-show="topologyEditable">

                  <div class="comment-template__item">
                    <p class="comment-template__leading">尺寸:</p>
                    <div class="comment-template__inner topology-config__editable">
                      <a-switch
                        checkedChildren="开"
                        unCheckedChildren="关"
                        v-model="topologyResizable"
                        @change="topologyResize" />
                    </div>
                  </div>
                  <!-- / 尺寸 -->

                  <div class="comment-template__item">
                    <p class="comment-template__leading">网格:</p>
                    <div class="comment-template__inner topology-config__editable">
                      <a-switch
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        :checked="isDisplayGrid"
                        @change="gridChange" />
                    </div>
                  </div>
                  <!-- / 网格 -->
                  <!-- / TODO: 持久化到配置 -->

                  <div class="comment-template__item">
                    <p class="comment-template__leading">模式:</p>
                    <div class="comment-template__inner topology-config__editable">
                      <a-radio-group
                        buttonStyle="solid"
                        v-model="mode"
                        @change="modeChange">
                        <a-radio-button value="edit">默认</a-radio-button>
                        <a-radio-button value="addEdge">连线</a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>
                  <!-- / 模式 -->

                  <div class="comment-template__item" v-show="mode === 'addEdge'">
                    <p class="comment-template__leading">连线形状:</p>
                    <div class="comment-template__inner topology-config__editable">
                      <a-radio-group
                        buttonStyle="solid"
                        v-model="edge.shape"
                        @change="edgeConfigChange">
                        <a-radio-button value="line">直线</a-radio-button>
                        <a-radio-button value="polyline">折线</a-radio-button>
                        <a-radio-button value="cubic">弧线</a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>
                  <!-- / 连线形状 -->

                  <EdgeTemplate
                    :model="edge"
                    v-show="edge && mode === 'addEdge'"
                    @change="edgeConfigChange" />
                  <!-- / 通用边编辑模板 -->

                </div>

              </a-collapse-panel>
              <!-- E 操作 -->

            </a-collapse>

            <CommonNodeTemplate v-if="topologyEditable && activeNode" ref="commonNodeTemplate">
              <template #header v-if="activeNodeModel && activeNodeModel.shape === NODE_TYPE_CIRCLE">
                <CiNodeDataSource />
              </template>
            </CommonNodeTemplate>
            <!-- / 节点通用配置 -->

            <CommonEdgeTemplate v-if="topologyEditable && activeEdge" ref="commonEdgeTemplate" />
            <!-- / 边通用配置 -->

          </div>

        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Grid from '@antv/g6/build/grid'
import { mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import ColorPicker from '@/components/ColorPicker'
import CommonTemplate from '../common'
import ChartProprietaryTemplate from '../chartProprietary'
import DataSourceTemplate from '../dataSource'
import ProprietaryMixins from '../proprietaryMixins'
import WrapperService from '@/components/Wrapper/WrapperService'
import CommonNodeTemplate from '@/views/design/modules/config/nodes'
import CommonEdgeTemplate from '@/views/design/modules/config/edges'
import EdgeTemplate from '@/views/design/modules/config/edges/edge'
import CiNodeDataSource from '../dataSource/CiNodeDataSource'
import {
  NODE_TYPE_CIRCLE
} from '@/plugins/g6-types'

export default {
  name: 'Topology',
  mixins: [ProprietaryMixins],
  components: {
    ColorPicker,
    CommonTemplate,
    ChartProprietaryTemplate,
    DataSourceTemplate,
    CommonNodeTemplate,
    CommonEdgeTemplate,
    EdgeTemplate,
    CiNodeDataSource
  },
  data: () => ({
    NODE_TYPE_CIRCLE,
    // 拓扑尺寸编辑
    topologyResizable: true,
    // 拓扑模式
    mode: 'edit',
    // 选择器服务
    wrapperService: new WrapperService()
  }),
  computed: {
    // 激活的面板
    activePanel () {
      return (this.activeNode && this.mode === 'default') || this.activeEdge ? 2 : 1
    },
    graph () {
      return this.activeWidget.render.chart
    },
    // 通用边配置
    edge () {
      return _.cloneDeep(this.edgeConfig)
    },
    activeNodeModel () {
      if (this.activeNode) {
        return Object.assign(
          _.cloneDeep(this.activeNode.getModel()),
          { radius: this.activeNode.getModel().size[0] / 2 }
        )
      } return null
    },
    // 是否显示拓扑网格
    isDisplayGrid () {
      return this.config.proprietaryConfig.plugins.includes('Grid')
    }
  },
  created () {
    this.resetTopologyState()
  },
  methods: {
    ...mapMutations('screen', {
      modifyTopologyEditable: ScreenMutations.MODIFY_TOPOLOGY_EDITABLE_STATUS,
      activateNode: ScreenMutations.ACTIVATE_NODE,
      resetTopologyState: ScreenMutations.RESET_TOPOLOGY_STATE,
      setEdgeConfig: ScreenMutations.SET_EDGE_CONFIG
    }),
    /**
       * 移除拓扑部件
       */
    remove () {
      this.topologyEditable && this.topologyEdit()
      this.removeWidget({ widgetId: this.activeWidget.widgetId })
    },
    /**
       * 拓扑图是否可编辑
       */
    topologyEdit () {
      // 更改拓扑图编辑状态
      this.modifyTopologyEditable({
        editable: !this.topologyEditable
      })

      // 设置拓扑图模式
      this.graph.setMode(this.topologyEditable ? 'edit' : 'default')

      // 对当前已激活可编辑的拓扑部件添加样式，以标注状态
      const { render: { container } } = this.activeWidget
      container.className = this.topologyEditable ? 'widget topology-widget' : 'widget'

      // 开启编辑时
      if (!this.topologyEditable) {
        // 取消编辑时选中该拓扑部件, 重置状态
        // 选中拓扑部件
        this.wrapperService.next({
          el: 'topology',
          value: true,
          widget: this.activeWidget
        })
        this.topologyResizable = true
        // 重置拓扑对象状态
        this.resetTopologyState()
      }
    },
    /**
       * 拓扑图是否可更改尺寸
       */
    topologyResize () {
      this.wrapperService.next({
        el: 'topology',
        value: this.topologyResizable,
        widget: this.activeWidget
      })
    },
    /**
       * 模式更改
       */
    modeChange () {
      const { render: { chart } } = this.activeWidget
      chart.setMode(this.mode)
    },
    /**
       * 边配置更改事件
       */
    edgeConfigChange () {
      this.setEdgeConfig({
        edgeConfig: this.edge
      })
    },
    /**
       * 拓扑网格显示更改事件
       */
    gridChange (isDisplayGrid) {
      const { plugins = [] } = this.config.proprietaryConfig
      const { render: { chart } } = this.activeWidget
      if (isDisplayGrid) {
        plugins.push('Grid')
        chart.addPlugin(new Grid())
      } else {
        const index = plugins.indexOf('Grid')
        plugins.splice(index, 1)
        const grid = chart.get('plugins').find(plugin => plugin instanceof Grid)
        chart.removePlugin(grid)
      }
      // TODO: Vuex mutation
    }
  }
}
</script>

<style scoped lang="less">
  .topology-config {

    &__editable {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
