<template>
  <div class="AlarmApprove">
    <div class="user">
      <CTable
        :columns="columns"
        :data="loadData"
        :expandedRowKeys="expandedRowKeys"
        ref="table"
        rowKey="id"
        :rowSelection="rowSelection"
        @expandedRowsChange="expandedRowsChange"
        :scroll="scroll"
      >
        <!-- / 操作区域 -->
        <template #query>
          <a-form layout="inline" class="form">
            <div :class="{ fold: !advanced }">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item label="审批状态" v-bind="formItemLayout" class="fw">
                    <a-select allowClear v-model="queryParams.review">
                      <a-select-option v-for="[value, label] in ALL_TASK_REVIEW_LIST" :key="value" :value="value">{{
                        label
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item label="日期范围" v-bind="formItemLayout" class="fw">
                    <a-range-picker
                      allowClear
                      class="fw"
                      format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="['开始时间', '结束时间']"
                      :showTime="{ format: 'HH:mm:ss' }"
                      v-model="queryParams.create_time"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item label="任务单号" v-bind="formItemLayout" class="fw" v-show="advanced">
                    <a-input-number
                      class="fw"
                      v-model="queryParams.id"
                      placeholder="请输入任务单号"
                    ></a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <span :class="advanced ? 'expand' : 'collapse'">
              <QueryBtn @click="query" />
              <ResetBtn @click="resetQueryParams" />
              <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
            </span>
          </a-form>
        </template>

        <!-- / 操作区域 -->
        <template #operation>
          <a-button @click="onApprove" :disabled="!hasSelectedOneTask">审批</a-button>
          <a-button @click="onBatchApprove" :disabled="!hasSelected">置为已审批</a-button>
        </template>

        <!--         // 子表：告警条目 -->
        <template v-slot:expandedRowRender="{ id, review }">
          <EventList
            :taskId="Number(id)"
            v-show="expandedRowKeys.includes(id)"
            :hasReviewed="review === TASK_REVIEW_ACCOMPLISHED"
            @selectSubRow="onSelectSubRow"
          />
        </template>
      </CTable>

      <ApproveSchema ref="schema" @success="query(false)"/>
    </div>
  </div>
</template>

<script>
import { PatrolService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import ApproveSchema from './modules/ApproveSchema/index'
import EventList from './modules/EventList'
import moment from 'moment'
import { TASK_REVIEW_ACCOMPLISHED, TASK_REVIEW_MAPPING, ALL_TASK_REVIEW_LIST } from '../typing'
import { PatrolTaskListService } from '@/api/service/PatrolTaskListService'

export default {
  name: 'AlarmApprove',
  mixins: [Confirm, List],
  props: {},
  components: {
    ApproveSchema,
    EventList
  },
  data: () => ({
    ALL_TASK_REVIEW_LIST,
    TASK_REVIEW_ACCOMPLISHED,
    columns: Object.freeze([
      {
        title: '任务单号',
        dataIndex: 'id',
        sorter: true,
        width: 90
      },
      // {
      //   title: '巡更区域',
      //   dataIndex: 'zone { alias }',
      //   width: 130,
      //   customRender: (__, { zone }) => _.get(zone, 'alias')
      // },
      {
        title: '计划名称',
        dataIndex: 'alias',
        sorter: true,
        width: 180
      },
      {
        title: '巡更组',
        dataIndex: 'group_name',
        width: 180
      },
      {
        title: '告警提交时间',
        dataIndex: 'actual_end_time',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 180,
        customRender: (actualEndTime) => actualEndTime ? moment(actualEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        title: '审批状态',
        dataIndex: 'review',
        sorter: true,
        width: 180,
        customRender: (review) => TASK_REVIEW_MAPPING.get(review)
      },
      {
        title: '巡更人员',
        dataIndex: 'executor',
        width: 130,
        customRender: (executor) => {
          if (!executor) {
            return ''
          } else if (executor === executor.toString()) {
            return executor.toString().slice(1, executor.length - 1)
          } else {
            return executor.executor
          }
        }
      },
      {
        title: '审批人员',
        dataIndex: 'reviewer',
        width: 130
      },
      {
        title: '审批时间',
        dataIndex: 'review_time',
        sorter: true,
        width: 180,
        customRender: value => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        title: '异常数量',
        dataIndex: 'total',
        width: 180
      }
    ]),
    queryParams: {
      review: '',
      create_time: ''
    },
    selectedEvents: {}
  }),
  computed: {
    // 一次只允许审批一个任务单下的多条告警
    hasSelectedOneTask () {
      return this.selectedTaskList.length === 1
    },
    rowSelection () {
      const { selectedRows, selectedRowKeys, selectRow: onChange } = this
      return {
        onChange,
        selectedRows,
        selectedRowKeys,
        getCheckboxProps: ({ review }) => ({
          props: {
            disabled: review === TASK_REVIEW_ACCOMPLISHED
          }
        })
      }
    },

    // 这里获取的是需要获取审批的 单号 与 详情
    selectedTaskList () {
      return Object.entries(this.selectedEvents).filter(([taskId, selectedEvents]) => selectedEvents.length)
    }
  },
  methods: {
    loadData (parameter) {
      // TODO: 重置 expandedRowKeys，可以在 CTable 组件对 dataSource 的 key 进行判断
      return PatrolTaskListService.find({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter.orderBy ? {} : { orderBy: { actual_end_time: 'desc_nulls_last' } },
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
    },
    /**
     * 详细审批（发送异常数据后修改任务单状态）
     */
    onApprove () {
      const [selectedTask] = this.selectedTaskList
      const [taskId, events] = selectedTask
      this.$refs['schema'].approve(taskId, events)
    },
    /**
     * 快速批量审批（直接修改任务单状态）
     */
    async onBatchApprove () {
      const user = { id: this.$store.getters.userId, name: this.$store.getters.nickname }
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认审批选中任务？',
        onOk: () =>
          PatrolService.eventTaskBatchApprove(this.selectedRowKeys, user)
            .then(() => {
              this.$notification.success({
                message: '系统提示',
                description: '审批成功'
              })
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },
    onSelectSubRow ({ selectedRows = [], taskId }) {
      if (_.isEmpty(selectedRows)) {
        this.$delete(this.selectedEvents, `${taskId}`)
      } else {
        this.$set(this.selectedEvents, `${taskId}`, selectedRows)
      }
    }
  }
}
</script>

<style lang="less">
</style>
