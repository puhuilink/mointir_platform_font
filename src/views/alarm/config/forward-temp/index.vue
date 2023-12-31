<template>
  <div class="ForwardTemp">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>

              <a-col :md="12" :sm="24">
                <a-form-item label="模板名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="启用状态" v-bind="formItemLayout" class="fw" v-action:M003010>
                  <a-select allowClear v-model.number="queryParams.enabled" >
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-select v-model="queryParams.mode" @change="query">
          <a-select-option
            v-for="(label, value) in allMode"
            :key="value"
            :value="value"
          >{{ label }}</a-select-option>
        </a-select>
        <a-button :disabled="!hasSelectedOne" @click="onDetail">查看</a-button>
        <a-button @click="onAdd" v-action:M003011>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M003012>编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M003013>删除</a-button>
      </template>
    </CTable>

    <ForwardTempSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)"
    />
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { AlarmTempService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import ForwardTempSchema from '../modules/ForwardTempSchema/index'
import { SEND_TYPE_MAPPING, ALL_SEND_TYPE_MAPPING } from '@/tables/alarm_rule/types'
import moment from 'moment'

export default {
  name: 'ForwardTemp',
  mixins: [List],
  components: {
    ForwardTempSchema
  },
  props: {},
  data: () => ({
    allMode: Object.freeze(
      Object.fromEntries(ALL_SEND_TYPE_MAPPING)
    ),
    columns: Object.freeze([
      {
        title: '模板名称',
        dataIndex: 'title',
        width: 200,
        sorter: true
      },
      {
        title: '通知方式',
        dataIndex: 'mode',
        width: 90,
        sorter: true,
        customRender: mode => SEND_TYPE_MAPPING.get(mode)
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        width: 200,
        sorter: true,
        customRender: time => time ? moment(time).format() : ''
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        width: 200,
        sorter: true,
        customRender: time => time ? moment(time).format() : ''
      },
      {
        title: '启用状态',
        dataIndex: 'enabled',
        width: 90,
        sorter: true,
        customRender: enabled => enabled ? '是' : '否'
      }
    ]),
    queryParams: {
      mode: ''
    }
  }),
  computed: {},
  methods: {
    loadData (parameter) {
      const { enabled, ...restQueryParams } = this.queryParams
      return AlarmTempService.find({
        where: {
          ...generateQuery({
            ...restQueryParams,
            ...enabled === undefined ? {} : { enabled: !!enabled }
          })
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onAdd () {
      this.$refs.schema.add()
    },
    onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => AlarmTempService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    },
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.detail(id)
    }
  }
}
</script>

<style lang="less">

</style>
