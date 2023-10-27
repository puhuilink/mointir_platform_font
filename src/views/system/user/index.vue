<template>
  <div class="user">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="用户名" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="姓名" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item label="邮箱" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.email" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="有效标识" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model="queryParams.flag" placeholder="请选择">
                    <a-select-option v-for="[value, label] in userFlags" :value="value" :key="value">{{ label }}</a-select-option>
                  </a-select>
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
        <a-button @click="onAddUser" v-action:M0101>新增</a-button>
        <a-button @click="onEditUser" :disabled="!hasSelectedOne" v-action:M0102>编辑</a-button>
        <a-button @click="onBatchDeleteUser" :disabled="!hasSelectedOne" v-action:M0103>删除</a-button>
        <a-button @click="onResetPwd" :disabled="!hasSelectedOne" v-action:M0105>重置密码</a-button>
        <a-button @click="onAllocateUserGroup" :disabled="!hasSelectedOne" v-action:M0104>分配工作组</a-button>
        <a-button @click="onToggleFlag" :disabled="!hasSelectedOne" v-action:M0111>更改状态</a-button>
        <a-button @click="onAllocateUserAuth" :disabled="!hasSelectedOne" v-action:M0110>分配权限</a-button>
        <a-button @click="onClearError" :disabled="!hasSelectedOne" v-action:M0110>解除限制</a-button>
        <a-button @click="onResetPoke" :disabled="!hasSelectedOne" v-action:M0110>令牌重置</a-button>
      </template>
    </CTable>

    <UserSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" />

    <AuthSchema v-action:M0110 ref="auth" @success="query(false)" />

    <UserGroupSchema v-action:M0104 ref="group" @editSuccess="query(false)" />
  </div>
</template>

<script>
import UserSchema from './modules/UserSchema'
import AuthSchema from '@/components/Auth/AuthSchema'
import UserGroupSchema from './modules/UserGroupSchema'
import { UserService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import { USER_FLAG } from '@/tables/user/enum'
import axios from 'axios'

export default {
  name: 'User',
  mixins: [Confirm, List],
  components: {
    UserSchema,
    AuthSchema,
    UserGroupSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '用户名',
        dataIndex: 'user_id',
        sorter: true,
        width: 180
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        width: 150,
        sorter: true
      },
      {
        title: '岗位职责',
        dataIndex: 'job_title',
        width: 170,
        tooltip: true
      },
      {
        title: '移动电话',
        dataIndex: 'mobile_phone',
        width: 120,
        sorter: true
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: 200,
        sorter: true
      },
      {
        title: '交建通',
        dataIndex: 'jjt',
        width: 200
      },
      {
        title: '有效标志',
        dataIndex: 'flag',
        width: 90,
        sorter: true,
        customRender: (flag) => (flag.toString() === USER_FLAG.enabled ? '有效' : '无效')
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 280,
        tooltip: true
      }
    ]),
    selectedRows: [],
    userFlags: [
      [0, '无效'],
      [1, '有效']
    ]
  }),
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
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return UserService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
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
      console.log('auth', record)
      this.$refs['auth'].edit(record)
    },
    /**
     * 为用户分配工作组
     * @event
     */
    onAllocateUserGroup () {
      const [record] = this.selectedRows
      this.$refs['group'].edit(record)
    },
    /**
     * 编辑用户
     * @event
     */
    onEditUser () {
      const [record] = this.selectedRows
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
            UserService.batchDelete(this.selectedRowKeys)
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
          UserService.setInitialPwd(_.first(this.selectedRowKeys))
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
          UserService.toggleFlag(user_id, flag === USER_FLAG.enabled ? USER_FLAG.disabled : USER_FLAG.enabled)
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
          UserService.clearError(user_id)
            .then(() => {
              this.$notifyClearErrorSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },

    // 令牌重置
    async onResetPoke () {
      const [{ user_id }] = this.selectedRows
      this.$promiseConfirmDelete({
        title: '令牌重置',
        content: '此操作将重置该用户登录令牌（导致现有令牌失效）, 是否继续？',
        closable: true,
        onOk: async () => {
          await axios.post(`/otp/otp/dereg`, {
            appId: process.env.VUE_APP_OTP_QUOTE_NAME,
            userName: user_id,
            transNo: 'transNo1'
          })
            .then(() => {
              this.$notification.success({
                message: '系统提示',
                description: '重置成功'
              })
            })
            .catch(this.$notifyError).finally(() => this.query())
        }
      })
    }
  }
}
</script>

<style lang='less'>
</style>
