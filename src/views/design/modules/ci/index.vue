<template>
  <ResourceTree
    instanceList
    hiddenTab
    draggable
    :rootKeys="['CommonCi']"
    @dragend="dragend"
  />
</template>

<script>
import { ResourceTree } from '@/components/Resource'
import { ViewDesignService } from '@/api-hasura'
import Factory from '@/model/factory/factory'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import { Range } from '@/model/common'
import IconPicker from '@/components/IconPicker'

export default {
  name: 'Ci',
  components: {
    ResourceTree
  },
  mixins: [IconPicker],
  props: {},
  data: () => ({
  }),
  computed: {
    ...mapState('screen', ['view', 'activeWidget', 'topologyEditable']),
    ...mapGetters('screen', ['widgets', 'scale'])
  },
  methods: {
    ...mapMutations('screen', {
      addWidget: ScreenMutations.ADD_WIDGET,
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      updateTopologyConfig: ScreenMutations.UPDATE_TOPOLOGY_CONFIG
    }),
    async dragend ({ event, node: { dataRef } }) {
      const options = await this.fetch(dataRef)
      const target = this.icons.find(icon => icon.name === options.icon_s)
      const other = this.icons.find(icon => icon.name === 'Others')
      const icon = target || other
      const data = {
        height: 64,
        label: dataRef.title,
        radius: '50%',
        shape: 'circle',
        width: 64,
        icon: {
          name: icon.name,
          height: 64,
          img: icon.img,
          position: 'inside',
          show: true,
          width: 64
        },
        style: {
          fill: 'rgba(24,144,255,0)',
          lineWidth: 0,
          radius: 0,
          stroke: 'rgba(145,213,255, 0)'
        }
      }
      if (this.isWithinTopologyScope(event)) {
        const { render } = this.activeWidget
        const graph = render.chart
        const { pageX, pageY } = event
        // 将屏幕/页面坐标转换为视口坐标
        const topologyCoordinate = graph.getPointByClient(pageX, pageY)
        const nodeFactory = Factory.createNodeFactory()
        const node = nodeFactory.create({
          ...data,
          x: topologyCoordinate.x,
          y: topologyCoordinate.y,
          size: [data.width, data.height]
        })
        // 添加节点
        graph.addItem('node', node)
        // 同步配置
        this.updateTopologyConfig()
      }
    },
    async fetch ({ name_s }) {
      const data = await ViewDesignService.nodeByCi(name_s)
      if (data) {
        // TODO: 其他属性引入
        const { label_s, name_s, parentname_s, values: { icon_s } } = data
        const option = {
          // 显示名称
          label_s,
          // model
          parentname_s,
          // ci
          name_s,
          // icon
          icon_s
        }
        return option
      }
    },
    /**
     * 鼠标是否在拓扑部件内
     * @param pageX
     * @param pageY
     * @returns {boolean|boolean}
     */
    isWithinTopologyScope ({ pageX, pageY }) {
      const { xRange, yRange } = this.getTopologyArea()
      return (pageX >= xRange.min && pageX <= xRange.max) &&
        (pageY >= yRange.min && pageY <= yRange.max)
    },
    /**
     * 获取拓扑部件区域信息
     * @returns {{xRange: *, yRange: *}}
     */
    getTopologyArea () {
      const [container] = document.getElementsByClassName('view')
      const { x, y, width, height } = container.getBoundingClientRect()
      return {
        xRange: new Range(x, x + width),
        yRange: new Range(y, y + height)
      }
    }
  }
}
</script>

<style lang="less">

</style>