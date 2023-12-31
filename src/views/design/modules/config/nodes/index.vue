/**
* 节点通用配置模板
* Author: dong xing
* Date: 2020/2/14
* Time: 1:39 下午
* Email: dong.xing@outlook.com
*/
<template>
  <div class="common-node-template common-template">

    <!-- S 节点通用配置顶部插槽 -->
    <slot name="header" :model="model" />
    <!-- E 节点通用配置顶部插槽 -->

    <a-collapse defaultActiveKey="1" :bordered="false">

      <!-- S 节点 -->
      <a-collapse-panel header="节点" key="1">

        <slot name="inside-header" :model="model" />
        <!-- / 节点通用配置内部顶部插槽 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">形状:</p>
          <div class="comment-template__inner comment-template__end">
            <b>{{ shape.get(model.shape) }}</b>
          </div>
        </div>
        <!-- / 形状 -->

        <div class="comment-template__item" v-if="model.icon">
          <p class="comment-template__leading">图标:</p>
          <div class="comment-template__inner">
            <IconPicker :icon="model.icon" @change="change('icon')" />
          </div>
        </div>
        <!-- / 图标 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">动画类型:</p>
          <div class="comment-template__inner">
            <a-select
              v-model="model.animateType"
              @change="animateTypeChange">
              <a-select-option value="none">无</a-select-option>
              <a-select-option
                v-for="(animateType, idx) in animateTypeList"
                :key="idx"
                :value="animateType"
              >{{ animateType }}</a-select-option>
              <!-- <a-select-option v-if="model.shape === NODE_TYPE_CIRCLE" value="real">实时</a-select-option> -->
              <a-select-option value="real">实时</a-select-option>
            </a-select>
          </div>
        </div>
        <!-- / 动画类型 -->

        <div class="comment-template__item" v-if="model.shape === 'rect'">
          <p class="comment-template__leading">圆角:</p>
          <div class="comment-template__inner comment-template__end">
            <a-input
              type="number"
              v-model.number="model.style.radius"
              min="0"
              @change="change" />
          </div>
        </div>
        <!-- / 圆角 -->

        <div class="comment-template__item" v-if="model.shape === 'circle'">
          <p class="comment-template__leading">半径:</p>
          <div class="comment-template__inner">
            <a-input
              type="number"
              v-model.number="model.radius"
              min="0"
              @change="radiusChange" />
          </div>
        </div>
        <!-- / 半径 -->

        <div v-else>
          <div class="comment-template__item">
            <p class="comment-template__leading">宽:</p>
            <div class="comment-template__inner comment-template__end">
              <a-input
                type="number"
                v-model.number="model.size[0]"
                min="0"
                @change="change" />
            </div>
          </div>
          <!-- / 宽 -->

          <div class="comment-template__item">
            <p class="comment-template__leading">高:</p>
            <div class="comment-template__inner comment-template__end">
              <a-input
                type="number"
                v-model.number="model.size[1]"
                min="0"
                @change="change" />
            </div>
          </div>
          <!-- / 高 -->

        </div>

        <div v-if="model.shape !== 'image'">

          <div class="comment-template__item">
            <p class="comment-template__leading">填充颜色:</p>
            <div class="comment-template__inner comment-template__end">
              <ColorPicker v-model="model.style.fill" @change="change" />
            </div>
          </div>
          <!-- / 填充颜色 -->

          <div class="comment-template__item">
            <p class="comment-template__leading">边框粗细:</p>
            <div class="comment-template__inner">
              <a-slider
                :min="0"
                :max="16"
                @change="change"
                v-model.number="model.style.lineWidth" />
            </div>
          </div>
          <!-- / 边框粗细 -->

          <div class="comment-template__item">
            <p class="comment-template__leading">边框颜色:</p>
            <div class="comment-template__inner comment-template__end">
              <ColorPicker v-model="model.style.stroke" @change="change" />
            </div>
          </div>
          <!-- / 边框颜色 -->

        </div>

        <div class="comment-template__item">
          <p class="comment-template__leading">文本:</p>
          <div class="comment-template__inner">
            <a-input
              type="text"
              v-model.trim="model.label"
              @change="change" />
          </div>
        </div>
        <!-- / 文本 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">文本颜色:</p>
          <div class="comment-template__inner">
            <ColorPicker v-model="model.labelCfg.style.fill" @change="change" />
          </div>
        </div>
        <!-- / 文本颜色 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">文本大小:</p>
          <div class="comment-template__inner">
            <a-input
              type="number"
              v-model.number="model.labelCfg.style.fontSize"
              min="0"
              @change="change" />
          </div>
        </div>
        <!-- / 文本大小 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">文本距离:</p>
          <div class="comment-template__inner">
            <a-input
              type="number"
              v-model.number="model.labelCfg.offset"
              min="0"
              @change="change" />
          </div>
        </div>
        <!-- / 文本距离 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">文本位置:</p>
          <div class="comment-template__inner">
            <a-select
              v-model="model.labelCfg.position"
              @change="change">
              <a-select-option value="center">居中</a-select-option>
              <a-select-option value="top">居上</a-select-option>
              <a-select-option value="bottom">居下</a-select-option>
              <a-select-option value="left">居左</a-select-option>
              <a-select-option value="right">居右</a-select-option>
            </a-select>
          </div>
        </div>
        <!-- / 文本位置 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">X:</p>
          <div class="comment-template__inner">
            <a-input
              type="number"
              v-model.number="model.x"
              min="0"
              @change="change" />
          </div>
        </div>
        <!-- / x坐标位置 -->

        <div class="comment-template__item">
          <p class="comment-template__leading">Y:</p>
          <div class="comment-template__inner">
            <a-input
              type="number"
              v-model.number="model.y"
              min="0"
              @change="change" />
          </div>
        </div>
        <!-- / y坐标位置 -->

        <div class="comment-template__item" v-if="model.img">
          <p class="comment-template__leading">图片:</p>
          <div class="comment-template__inner">
            <a-textarea v-model.trim="model.img" @change="change" />
          </div>
        </div>
        <!-- / 图片 -->

      </a-collapse-panel>
      <!-- / 节点 -->

      <!--新增依据metric_id来增加告警规则      -->
      <a-collapse-panel header="告警依据" key="2">
        <div class="comment-template__item">
          <p class="comment-template__leading">依据ID</p>
          <div class="comment-template__inner">
            <a-input v-model="model.Basis" @change="change"></a-input>
          </div>
        </div>
      </a-collapse-panel>

    </a-collapse>

    <!-- S 节点通用配置默认插槽 -->
    <slot :model="model" />
    <!-- E 节点通用配置默认插槽 -->

  </div>
</template>

<script>
import '@/assets/less/template.less'
import IconPicker from '@/components/IconPicker'
import ColorPicker from '@/components/ColorPicker'
import NodesMixins from '../dataSourceMixins/nodes'
import { animateTypeMapping } from '@/plugins/g6'
import {
  NODE_TYPE_CIRCLE,
  NODE_TYPE_ELLIPSE,
  NODE_TYPE_RECT,
  NODE_TYPE_IMAGE
} from '@/plugins/g6-types'

export default {
  name: 'CommonNodeTemplate',
  mixins: [NodesMixins],
  components: { IconPicker, ColorPicker },
  data: () => ({
    NODE_TYPE_CIRCLE,
    shape: new Map([
      [NODE_TYPE_CIRCLE, '圆形'],
      [NODE_TYPE_RECT, '矩形'],
      [NODE_TYPE_ELLIPSE, '椭圆形'],
      [NODE_TYPE_IMAGE, '图片']
    ]),
    animateTypeList: [...animateTypeMapping()].map(([type]) => type)
  }),
  methods: {
    /**
     * 原型节点半径配置更新
     */
    radiusChange () {
      this.model.size = [this.model.radius * 2, this.model.radius * 2]
      this.change()
    },
    /**
     * 节点动画类型更新
     */
    animateTypeChange () {
      const { render: { chart } } = this.activeWidget
      const { id, animateType } = this.model
      chart.clearItemStates(id)
      chart.setItemState(id, animateType, true)
      // 更新配置
      this.change()
    }
  }
}
</script>

<style scoped>

</style>
