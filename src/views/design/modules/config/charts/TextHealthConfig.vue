/**
* 文本健康度注解配置
*/

<template>
  <div class="texts-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="样式" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 文本样式 -->
            <a-collapse-panel header="文本样式" key="1">

              <div class="comment-template__item">
                <p class="comment-template__leading">缺省值:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.title.text"
                    @change="change" />
                </div>
              </div>
              <!-- / 文本 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">特殊样式:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model="config.proprietaryConfig.type"
                    @change="change" />
                </div>
              </div>
              <!-- / 文本 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">小数位数:</p>
                <div class="comment-template__inner">
                  <a-slider
                    v-model="config.proprietaryConfig.decimalPoint"
                    @change="change()"
                    :min="-1"
                    :max="4" />
                </div>
              </div>
              <!-- / 小数点保留 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.title.textStyle.color"
                    @change="change()" />
                </div>
              </div>
              <!-- / 颜色 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.textStyle.fontSize" />
                </div>
              </div>
              <!-- / 大小 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">粗细:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.title.textStyle.fontWeight"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="lighter">细</a-select-option>
                    <a-select-option value="bold">粗</a-select-option>
                    <a-select-option value="bolder">更粗</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 粗细 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">位置:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.title.position.mode"
                    @change="positionChange">
                    <a-select-option value="center">水平垂直居中</a-select-option>
                    <a-select-option value="center_left">垂直居中-居左</a-select-option>
                    <a-select-option value="center_right">垂直居中-居右</a-select-option>
                    <a-select-option value="top_center">居上-水平居中</a-select-option>
                    <a-select-option value="bottom_center">居下-水平居中</a-select-option>
                    <a-select-option value="custom">自定义</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 位置 -->

              <div
                class="comment-template__item"
                v-show="config.proprietaryConfig.title.position.editablePosition.includes('left')">
                <p class="comment-template__leading">居左:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.left" />
                </div>
              </div>
              <!-- / 居左 -->

              <div
                class="comment-template__item"
                v-show="config.proprietaryConfig.title.position.editablePosition.includes('right')">
                <p class="comment-template__leading">居右:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.right" />
                </div>
              </div>
              <!-- / 居右 -->

              <div
                class="comment-template__item"
                v-show="config.proprietaryConfig.title.position.editablePosition.includes('top')">
                <p class="comment-template__leading">居上:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.top" />
                </div>
              </div>
              <!-- / 居上 -->

              <div
                class="comment-template__item"
                v-show="config.proprietaryConfig.title.position.editablePosition.includes('bottom')">
                <p class="comment-template__leading">居下:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.bottom" />
                </div>
              </div>
              <!-- / 居下 -->

              <ThresholdColor :name="value"/>

            </a-collapse-panel>
            <!-- E 文本样式 -->
          </a-collapse>
        </div>
      </a-tab-pane>

      <a-tab-pane tab="数据" key="3" forceRender>
        <TextHealthDataSource />
      </a-tab-pane>

    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
import ColorPicker from '@/components/ColorPicker'
import TextHealthDataSource from '../dataSource/TextHealthDataSource'
import ThresholdColor from '../common/ThresholdColor'

export default {
  name: 'TextHealthConfig',
  mixins: [ProprietaryMixins],
  data () {
    return {
      value: 'TextHealth'
    }
  },
  components: {
    CommonTemplate,
    ColorPicker,
    TextHealthDataSource,
    ThresholdColor
  },
  // watch: {
  //   'config.proprietaryConfig.title.textStyle.color': {
  //     handler (value) {
  //       console.log()
  //       this.config.proprietaryConfig.title.defaultColor = value
  //       console.log('listen', value, this.config.proprietaryConfig.title.defaultColor)
  //     }
  //   }
  // },
  methods: {
    positionChange () {
      const { position = {} } = this.config.proprietaryConfig.title
      const { mode, left = 0, right = 0, top = 0, bottom = 0 } = position
      switch (mode) {
        case 'center':
          Object.assign(position, { editablePosition: [] })
          break
        case 'center_left':
          Object.assign(position, { editablePosition: ['left'], left })
          break
        case 'center_right':
          Object.assign(position, { editablePosition: ['right'], right })
          break
        case 'top_center':
          Object.assign(position, { editablePosition: ['top'], top })
          break
        case 'bottom_center':
          Object.assign(position, { editablePosition: ['bottom'], bottom })
          break
        case 'custom':
          Object.assign(position, {
            editablePosition: ['top', 'bottom', 'left', 'right'],
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          })
          break
        default:
          Object.assign(position, { editablePosition: [] })
          break
      }
      this.change()
    }
  }
}
</script>

<style scoped lang="less">
</style>
