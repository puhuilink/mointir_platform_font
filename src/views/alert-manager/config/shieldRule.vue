<template>
  <div class="deliverRules">
    <div style="margin-bottom:10px;display: flex;flex-direction: row-reverse">
      <a-button icon="plus" type="primary" @click="openModal(null)">新建屏蔽规则</a-button>
    </div>
    <a-modal
      :title="updateFlag?'修改屏蔽规则':'新建屏蔽规则'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="1100px"
      @ok="handleOk"
      @cancel="closeModal"
      @close="closeModal"
    >
      <a-form-model
        ref="ruleForm"
        :model="formState"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol">
        <a-form-model-item
          label="屏蔽策略名称"
          :rules="[{ required: true, message: '屏蔽策略名称必填', trigger: 'change' }]"
          prop="policy_name"
        >
          <a-input v-model="formState.policy_name" />
        </a-form-model-item>
        <a-form-model-item
          label="告警源"
          :rules="[{ required: true, message: '告警源必选', trigger: 'change' }]"
          prop="source_id">
          <a-select
            label-in-value
            :value="{ key: formState.source_id,label:formState.source_name }"
            :options="alertSource"
            @change="sourceChange" />
        </a-form-model-item>
        <a-form-model-item
          label="屏蔽规则"
          :rules="[{ required:true, type: 'array', validator:sourcePass, trigger: 'change' }]"
          prop="policy_source">
          <div style="">
            <div
              style="display: grid;
            grid-template-columns: 60px 1fr;
            grid-auto-columns: 1fr;"
              v-for="(map,index) in formState.policy_source"
              :key="index">
              <a-avatar :size="32" class="circle"> {{ index + 1 }}</a-avatar>
              <div>
                <div style="display: flex;align-items: center;">
                  规则之间的条件：
                  <a-radio-group :options="options" v-model="map.group_relation" :default-value="1" />
                  <div style="display: flex;flex-direction: revert">
                    <a-icon
                      type="delete"
                      v-if="formState.policy_source.length !== 1"
                      @click="deleteStrategyByIndex(index)" />
                  </div>
                </div>
                <div v-for="(m,i) in map.group_condition" :key="i">
                  <a-select
                    v-model="m.condition_name"
                    style="width: 25%;margin-right: 5px"
                    :options="conditions[0]"
                    @change="nameChange(m)" />
                  <a-select
                    v-model="m.condition_symbol"
                    style="width: 25%;margin-right: 5px"
                    :options="conditions[1]" />
                  <span>
                    <a-select
                      mode="multiple"
                      v-model="m.condition_value"
                      style="width: 40%;margin-right: 5px"
                      :options="conditions[2]"
                      v-if="m.condition_name === '294504721270575106'" />
                    <a-input v-else v-model="m.condition_value" style="width: 30%;margin-right: 5px" />
                  </span>
                  <div
                    :style="{ visibility: map.group_condition.length > 1 ? 'default' : 'hidden', display: 'inline' }">
                    <a-icon type="delete" @click="deleteRuleByIndex(index,i)" />
                    <a-divider type="vertical" />
                  </div>
                  <a-icon type="plus" @click="addRule(index)" />
                </div>
              </div>
            </div>
          </div>

          <a-button class="add_button" @click="addStrategy"> 增加</a-button>
        </a-form-model-item>
        <a-form-model-item
          label="生效时间"
          :rules="[{ required: true ,message: '生效时间必选', trigger: 'change' }]"
          prop="start_time">
          <a-date-picker
            show-time
            placeholder="生效时间 "
            @change="onStartChange"
            format="YYYY-MM-DDTHH:mm:ssZ"
            style="width: 50%" />
        </a-form-model-item>
        <a-form-model-item
          label="失效时间"
          :rules="[{ required: true, message: '失效时间必选', trigger: 'change' }, { trigger: 'change'}]"
          prop="end_time">
          <a-date-picker
            show-time
            placeholder="失效时间 "
            @change="onEndChange"
            format="YYYY-MM-DDTHH:mm:ssZ"
            style="width: 50%"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="屏蔽规则详情"
      :visible="show"
      width="1100px"
      @ok="closeShow"
      @cancel="closeShow"
      @close="closeShow"
    >
      <div>策略名称：{{ watchForm.policy_name }}</div>
      <div>告警源：{{ watchForm.source_name }}</div>
      <div>屏蔽条件：
        <div
          style="display: grid;
            grid-template-columns: 40px 1fr;
            grid-auto-columns: 1fr;"
          v-for="(map,index) in watchForm.policy_source"
          :key="index">
          <a-avatar :size="24" class="circle"> {{ map.group_relation === '1' ? '或' : '且' }}</a-avatar>
          <div
            style="display: grid;
            grid-template-rows: 50px 50px;
            grid-auto-rows: 50px;">
            <div v-for="(m,i) in map.group_condition" :key="i">
              <a-select
                disabled
                v-model="m.condition_name"
                style="width: 25%;margin-right: 5px"
                :options="conditions[0]"
                :show-arrow="false"
              />
              <a-select
                disabled
                v-model="m.condition_symbol"
                style="width: 25%;margin-right: 5px"
                :options="conditions[1]"
                :show-arrow="false"
              />
              <span>
                <a-select
                  disabled
                  mode="multiple"
                  v-model="m.condition_value"
                  style="width: 40%;margin-right: 5px"
                  :options="conditions[2]"
                  v-if="m.condition_name === '294504721270575106'"
                  :show-arrow="false"
                />
                <a-input disabled v-else v-model="m.condition_value" style="width: 30%;margin-right: 5px" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-table
      bordered
      :columns="columns"
      :pagination="pagination"
      :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template :slot="'levelUp'" slot-scope="text,record">
        {{ record.policy_account.length > 1 ? '是' : '否' }}
      </template>
      <template :slot="'content'" slot-scope="text,record">
        {{ notifyContent(record) }}
      </template>
      <template :slot="'action'" slot-scope="text,record">
        <a-button @click="showModal(record)">查看</a-button>
        <a-divider type="vertical" />
        <a-button @click="openModal(record)">编辑</a-button>
        <a-divider type="vertical" />
        <!--        <a-switch :checked="record.status" size="small" />-->
        <!--        <a-divider type="vertical" />-->
        <a-popconfirm
          title="确定要删除此策略?"
          placement="left"
          @confirm="deleteStrategy(record.ID)"
          okText="确定"
          cancelText="取消"
        >
          <a-button>删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <!--    <DetailSchema ref="schema" @close="onClose"></DetailSchema>-->
  </div>
</template>

<script>
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
import _ from 'lodash'
import { ApSourceService } from '@/api/service/ApSourceService'
import store from '@/store/index'
import { alarm } from '@/utils/request'
import { judgeRoleToAlertView } from '@/utils/util'
import { USER } from '@/store/mutation-types'
import Vue from 'vue'

const columns = [
  {
    title: '规则名称',
    align: 'center',
    dataIndex: 'policy_name'
  },
  {
    title: '关联告警源',
    align: 'center',
    dataIndex: 'source_name'
  },
  {
    title: '规则内容',
    align: 'center',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '生效时间',
    align: 'center',
    dataIndex: 'start_time'
  },
  {
    title: '失效时间',
    align: 'center',
    dataIndex: 'end_time'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
const data = []
const pagination = {
  pageSizeOptions: ['5', '10', '20', '30'],
  defaultCurrent: 1,
  pageSize: 10,
  defaultPageSize: 10,
  hideOnSinglePage: false,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
}

const originalRule = {
  id: '',
  policy_source_id: '',
  condition_name: '',
  condition_symbol: '',
  condition_value: ''
}
const originalStrategy = {
  id: '',
  policy_id: '',
  policy_name: '',
  group_relation: '1',
  group_condition: [
    _.cloneDeep(originalRule)
  ]
}

const originalData = {
  id: '',
  policy_name: '',
  source_id: '',
  source_name: '',
  policy_type: '1',
  start_time: '0001-01-01T00:00:00Z', // 屏蔽策略时需填写 ，分配策略时忽略
  end_time: '0001-01-01T00:00:00Z', // 屏蔽策略时需填写 ，分配策略时忽略
  create_time: '0001-01-01T00:00:00Z', // 策略创建时间
  creator: '', // 策略创建人
  update_time: '0001-01-01T00:00:00Z', // 策略最后更新时间
  updator: '', // 策略最后更新人
  enabled: true, // 策略启停用 0 - 停用， 1 - 启用
  policy_source: [
    _.cloneDeep(originalStrategy)
  ],
  policy_account: []
}

export default {
  name: 'ShieldRule',
  data () {
    return {
      show: false,
      updateFlag: false,
      conditions: [
        [], [], []
      ],
      alertSource: [],
      group: [],
      user: [],
      colLayout: {
        xl: 8,
        md: 12,
        sm: 24
      },
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 8 }, xxl: { span: 4 } },
        wrapperCol: {
          xs: { span: 10, offset: 0 },
          md: { span: 14, offset: 0 },
          xl: { span: 14, offset: 2 },
          xxl: { span: 20, offset: 0 }
        }
      },
      data,
      columns,
      pagination,
      a: 0,
      visible: false,
      confirmLoading: false,
      selectedRowKeys: [],
      title: '压缩告警详情',
      options: [
        { label: '或', value: '1' },
        { label: '且', value: '0' }
      ],
      formState: _.cloneDeep(originalData),
      watchForm: _.cloneDeep(originalData),
      isAdmin: false
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
    async deleteStrategy (id) {
      const res = await alarm.post('/platform/policy/delete', { id })
      if (res.code === 200) {
        this.$message.success('删除成功！')
        await this.fetchList()
      } else {
        this.$message.error(res.msg)
      }
    },
    async fetchList () {
      const { data } = await alarm.post('/platform/policy/find', {
        limit: 25,
        offset: 1,
        account_id: store.getters.userId,
        policy_type: '1'
      })
      if (data) {
        this.data = data
      }
    },
    nameChange (entity) {
      if (entity.condition_name === '294504721270575106') {
        entity.condition_value = []
      }
    },
    async fetchSource () {
      const res = await ApSourceService.fetchAllSourceList()
      this.alertSource = []
      // console.log('res', res)
      res.forEach(r => {
        this.alertSource.push(
          {
            label: r.name,
            value: r.id
          }
        )
      })
    },
    sourcePass (rule, value, callback) {
      let flag = false
      value.forEach(v => {
        if (flag) {
          return false
        }
        v.group_condition.forEach(condition => {
          if (flag) {
            return false
          }
          flag = condition.condition_name === '' || condition.condition_symbol === '' || condition.condition_value === ''
        })
      })
      if (flag) {
        callback(new Error('请检查屏蔽条件是否填写正确！'))
      } else {
        callback()
      }
    },
    async fetchGroup () {
      const res = await ApSourceService.fetchGroupList()
      this.group = []
      res.forEach(r => {
        this.group.push(
          {
            label: r.name,
            value: r.id
          }
        )
      })
    },
    async fetchUser () {
      const res = await ApSourceService.fetchUserList()
      this.user = []
      res.forEach(r => {
        this.user.push(
          {
            label: r.staff_name,
            value: r.user_id
          }
        )
      })
    },
    onStartChange (value, dateString) {
      if (dateString) {
        this.formState.start_time = dateString
      }
    },
    onEndChange (value, dateString) {
      if (dateString) {
        this.formState.end_time = dateString
      }
    },
    async fetchCondition (condition_type) {
      const data = await ApSourceService.fetchDictList(condition_type)
      const arr = []
      data.forEach(d => {
        arr.push({
          label: d.condition_value,
          value: d.id
        })
      })
      this.conditions[Number(condition_type) - 1] = arr
    },
    openModal (record) {
      const user = store.getters.userId
      this.isAdmin = user === 'administrator'
      if (record !== null && record !== {}) {
        this.updateFlag = true
        this.formState = { ..._.cloneDeep(record) }
        this.formState.policy_source.forEach(source => {
          source.group_condition.forEach(condition => {
            try {
              // condition.condition_value = JSON.parse(condition.condition_value)
              condition.condition_value = condition.condition_value.split(',')
            } catch (e) {
              console.log(e)
            }
          })
        })
      } else {
        if (this.alertSource.length) {
          setTimeout(() => {
            this.sourceChange(this.alertSource[0])
          }, 1000)
        } else {
          this.$message.error('该通知组未创建数据源或已存在屏蔽策略！')
        }
        this.updateFlag = false
      }
      this.visible = true
    },
    showModal (record) {
      this.watchForm = { ..._.cloneDeep(record) }
      this.watchForm.policy_source.forEach(source => {
        source.group_condition.forEach(condition => {
          try {
            // condition.condition_value = JSON.parse(condition.condition_value)
            condition.condition_value = condition.condition_value.split(',')
          } catch (e) {
            console.log(e)
          }
        })
      })
      this.show = true
    },
    closeShow () {
      this.show = false
      this.watchForm = { ..._.cloneDeep(originalData) }
    },
    closeModal () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
      this.formState = { ..._.cloneDeep(originalData) }
    },
    addStrategy () {
      if (this.formState.policy_source.length > 8) {
        this.$message.warn('最多只能有9条策略！')
        return
      }
      this.formState.policy_source.push(
        { ..._.cloneDeep(originalStrategy) }
      )
      this.$forceUpdate()
    },
    deleteStrategyByIndex (index) {
      this.formState.policy_source.splice(index, 1)
    },
    notifyLevelDownByIndex (index) {
      this.formState.policy_account.splice(index, 1)
    },
    deleteRuleByIndex (index, i) {
      this.formState.policy_source[index].group_condition.splice(i, 1)
    },
    addRule (index) {
      if (this.formState.policy_source[index].group_condition.length > 4) {
        this.$message.warn('最多只能有五条规则！')
        return
      }
      this.formState.policy_source[index].group_condition.push(
        { ..._.cloneDeep(originalRule) }
      )
      this.$forceUpdate()
    },
    notifyLevelUp () {
      if (this.formState.policy_account.length > 3) {
        this.$message.warn('通知最多只能升级三次！')
        return
      }
      this.formState.policy_account.push(
        {
          'id': '',
          'policy_id': '',
          'account_id': '',
          'group_id': '',
          'upgrade_interval': 30, // 告警升级时间
          'account_type': '1'
        }
      )
    },
    sourceChange (e) {
      if (!e) {
        this.$message.error('找不到正确的告警源！')
      }
      if (Object.hasOwn(e, 'value')) {
        this.formState.source_id = e.value
      } else {
        this.formState.source_id = e.key
      }
      this.formState.source_name = e.label
      // console.log('111')
    },
    async handleOk () {
      let flag = false
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.error('请检查您的表单项是否都填写完毕！')
          flag = true
        }
      })
      if (flag) {
        return
      }
      const backup = { ..._.cloneDeep(this.formState) }
      backup.policy_source.forEach((source, index) => {
        source.source_id = this.formState.source_id
        source.source_name = this.formState.source_name
        source.group_sequence = index + 1
        source.group_condition.forEach((condition, i) => {
          condition.condition_sequence = i + 1
          condition.condition_value = condition.condition_value.toString()
          if (Array.isArray(condition.condition_value)) {
            condition.condition_value = JSON.stringify(condition.condition_value)
          }
        })
      })
      let url = ''
      if (this.updateFlag) {
        backup.updator = store.getters.userId
        url = '/platform/policy/update'
      } else {
        backup.creator = store.getters.userId
        url = '/platform/policy/add'
      }
      backup.policy_account = [{ // 策略分派人
        id: '', // 策略分派人ID，新增时为空，修改时需填写
        policy_id: '', // 策略ID，新增时为空，修改时需填写
        account_id: store.getters.userId, // 立即通知人ID
        group_id: '', // 立即通知组ID
        upgrade_interval: 0, // 告警升级时间
        upgrade_count: 0, // 升级次数，0代表立即通知
        account_type: '1' // 通知组/人，0 - 通知组， 1 - 通知人
      }]
      const res = await alarm.post(url, backup)
      if (res.code === 200) {
        this.$message.success(this.updateFlag ? '修改成功' : '新建成功！')
        this.closeModal()
        await this.fetchList()
      } else {
        this.$message.error(res.msg)
      }
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    notifyContent (record) {
      try {
        let str = ''
        record.policy_source.forEach(source => {
          let length = 0
          const relation = this.options.find(o => o.value === source.group_relation).label
          source.group_condition.forEach(c => {
            str += this.conditions[0].find(c0 => c0.value === c.condition_name).label +
              this.conditions[1].find(c1 => c1.value === c.condition_symbol).label
            const arr = c.condition_value.split(',')
            if (arr.length > 0) {
              let valueStr = ''
              let valueLength = 0
              arr.forEach(a => {
                valueStr += this.conditions[2].find(c2 => c2.value === a).label
                valueLength++
                if (valueLength < arr.length) {
                  valueStr += ','
                }
              })
              str += '(' + valueStr + ')'
            } else {
              str += this.conditions[2].find(c2 => c2.value === c.condition_value).label
            }
            length++
            if (length < source.group_condition.length) {
              str += relation
            }
          })
          str += '\n'
        })
        return str
      } catch (e) {
        console.log(e)
        return '无分派人信息'
      }
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    onChangeState (activeKey) {
      this.state = activeKey
    },
    query () {
      // TODO 查询
    },
    resetQueryParams () {
      // TODO 重置查询
    },
    // 认领告警
    claimAlarm (record) {
      console.log('认领', record)
    },
    // 关闭或批量关闭告警
    closeAlarm (record) {

    },
    showDetail () {
      this.$refs.schema.show('压缩告警详情')
      // TODO 交互详情内容
    },
    onClose () {
      console.log('关闭')
      this.visible = false
    }
  },
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  async mounted () {
    await this.fetchCondition('1')
    await this.fetchCondition('2')
    await this.fetchCondition('3')
    await this.fetchList()
    await this.fetchSource()
    await this.fetchGroup()
    await this.fetchUser()
  },
  beforeCreate () {
    judgeRoleToAlertView()
  }
}
</script>

<style lang='less' scoped>
.circle {
  background: rgba(9, 117, 209, 0.10);
  color: #0975D1;
}

.add_button {
  width: 100px;
  background-color: rgba(34, 127, 230, 1);
  color: white
}

* {
  marigin: 0px;
  //background-color: #EFF3F7;
}

.header {
  //padding: 10px;
  width: 100%;
}

.left {
  float: left;
  width: 40%;
}

-
.wd {
  width: 100%;
}

.hg {
  height: 100%;
}

.form {
  margin-right: 10px;

  .fold {
    flex: 1;
    display: inline-block;
    width: calc(100% - 216px);
  }

  .collapse {
    float: right;
    overflow: hidden;
    transform: translateY(3.5px);
  }
}

.right {
  float: right;
  width: 75%;

  &_range_picker {
    width: 160px;
  }

  &_input {
    width: 120px;
  }
}

.center {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
