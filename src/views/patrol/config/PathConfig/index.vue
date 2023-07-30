<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item label="路线名称" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="queryParams.alias" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <span class="collapse">
        <a-button @click="query" type="primary">查询</a-button>
        <a-button @click="resetQueryParams" >重置</a-button>
      </span>
    </a-form>

    <!-- / 操作区域 -->
    <a-button @click="onAddUser" v-action:M0101>新增</a-button>
    <a-table
      :columns="columns"
      :dataSource="defaultData"
      ref="table"
      rowKey="role_code"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #index="text,record,index">{{ index }}</template>
      <template #status="text,record,index">{{ replaceGroupName(text) }}</template>
      <template #action="text,record">
        <a @click="onEditUser(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="onUpdateMenu(record)">配置巡更路径</a>
        <a-divider type="vertical" />
        <a @click="deleteRole(record)">删除</a>
      </template>
    </a-table>

    <PathSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" />
  </div>
</template>

<script>
import PathSchema from './modules/PathSchema.vue'
import { PathService, RoleService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import { USER_FLAG } from '@/tables/user/enum'
import { xungeng } from '@/utils/request'

export default {
  name: 'Path',
  mixins: [Confirm, List],
  components: {
    PathSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '序号',
        dataIndex: 'index',
        width: '120px',
        scopedSlots: { customRender: 'index' }
      },
      {
        title: '巡更路径名称',
        dataIndex: 'alias',
        width: '150px',
        sorter: true
      },
      {
        title: '巡更组',
        dataIndex: 'groupId',
        scopedSlots: { customRender: 'status' },
        width: '80px',
        sorter: true
      },
      {
        title: '提交人',
        dataIndex: 'updator',
        width: '120px',
        sorter: true
      },
      {
        title: '提交时间',
        dataIndex: 'updateTime',
        width: '200px'
      },
      {
        title: '操作',
        width: '400px',
        scopedSlots: { customRender: 'action' }
      }
    ]),
    dataList: [],
    defaultData: [],
    selectedRows: [],
    queryParams: {
      alias: null
    }
  }),
  mounted () {
    this.query()
  },
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !!selectedRows.find(({ flag }) => flag === USER_FLAG.enabled)
      } else {
        return false
      }
    }
  },
  methods: {
    replaceGroupName (text) {
      const arr = this.dataList.filter(element => element.id === text)
      console.log(text, arr)
      if (arr && arr.length) {
        return arr[0].name
      }
      return ''
    },
    resetQueryParams () {
      this.queryParams = {
        alias: null
      }
    },
    query () {
      this.getList()
      this.loadData(this.queryParams)
      setInterval(() => this.loadData(this.queryParams), 60000)
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      const { alias } = parameter
      const res = await PathService.find(alias)
      if (res) {
        this.defaultData = res.list
      } else {
        this.defaultData = []
      }
    },
    // 4.工作组列表
    async getList () {
      const pageNum = 1
      const pageSize = 9999
      const { data } = await xungeng.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
      this.dataList = data.list
    },
    /**
     * 编辑菜单权限
     * @event
     */
    async onUpdateMenu (record) {
      const res = await PathService.getPathList(record.id)
      const {
        zones
      } = res
      await this.$router.push({
        path: '/patrol/config/pathConfig',
        query: { pathId: record.id, zoneId: zones[0].zoneId }
      })
    },
    /**
     * 编辑数据权限
     * @event
     */
    onUpdateData (record) {
      this.$refs['singleSchema'].updateData(record)
    },
    /**
     * 新增用户
     * @event
     */
    onAddUser () {
      this.$refs['schema'].add()
    },
    /**
     * 为用户分配权限
     * @event
     */
    onAllocateUserAuth () {
      const [record] = this.selectedRows
      this.$refs['auth'].edit(record)
    },
    /**
     * 为用户分配工作组
     * @event
     */
    onAllocateUserGroup (record) {
      this.$refs['group'].edit(record)
    },
    /**
     * 编辑用户
     * @event
     */
    onEditUser (record) {
      this.$refs['schema'].edit(record)
    },
    /**
     * 批量删除用户
     * @event
     */
    async onBatchDeleteUser () {
      const [{ flag }] = this.selectedRows
      const title = flag === USER_FLAG.enabled ? '无法删除' : '删除'
      const content = flag === USER_FLAG.enabled ? '只能删除无效用户' : '确定要删除选中的记录吗？'
      const onOk = flag === USER_FLAG.enabled ? 1 : 0
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: () => {
          if (onOk === 1) {
          } else {
            RoleService.batchDelete(this.selectedRowKeys)
              .then(() => {
                this.$notifyDeleteSuccess()
                this.query(false)
              })
              .catch(this.$notifyError)
          }
        }
      })
    },
    /**
     * 删除路线
     * @event
     */
    async deleteRole (record) {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除该路线吗',
        onOk: () => {
          PathService.deletePath(record.id)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
        }

      })
    },

    /**
     * 重置用户密码
     * @event
     */
    onResetPwd () {
      const { userId } = this.$store.getters
      const [selectedUserId] = this.selectedRowKeys
      if (userId === selectedUserId) {
        this.$message.warning('当前账号密码请至个人中心重置！')
        return
      }
      this.$promiseConfirm({
        title: '系统提示',
        content: '是否重置选中用户密码？',
        onOk: () =>
          RoleService.setInitialPwd(_.first(this.selectedRowKeys))
            .then(() => {
              this.$notification.success({
                message: '系统提示',
                description: '密码已重置为初始化密码！'
              })
            })
            .catch(this.$notifyError)
      })
    },
    /**
     * 变更用户状态
     * @event
     */
    async onToggleFlag () {
      const [{ user_id, flag }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认更改用户状态？',
        onOk: () =>
          RoleService.toggleFlag(user_id, flag === USER_FLAG.enabled ? USER_FLAG.disabled : USER_FLAG.enabled)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },
    /**
     * 清除用户错误次数
     * @event
     */
    async onClearError () {
      const [{ user_id }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认解除用户限制？',
        onOk: () =>
          RoleService.clearError(user_id)
            .then(() => {
              this.$notifyClearErrorSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    }
  }
}
</script>

<style lang='less'>
</style>