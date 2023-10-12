<template>
  <div>
    <a-steps :current="current">
      <a-step :key="'form'" title="基本信息" />
      <a-step :key="'json'" title="json解析" />
      <a-step :key="'mapping'" title="关系映射" />
    </a-steps>
    <div class="steps-content">
      <a-form-model
        v-if="current === 0"
        :label-col="{ span: 4 }"
        :model="formState"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        ref="ruleForm"
        style="margin-top: 30px"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-model-item
          :rules="[{ required: true, message: '请输入告警源名称！', trigger: 'change' }]"
          label="告警源名称"
          prop="name"
        >
          <a-input v-model="formState.name" style="width: 200px" />
        </a-form-model-item>
        <a-form-model-item
          :rules="[{ required: true, message: '请输入告警源IP！', trigger: 'change' }]"
          label="告警源IP"
          prop="ip"
        >
          <a-input v-model="formState.ip" style="width: 200px" />
        </a-form-model-item>

        <a-form-model-item
          :rules="[{ required: true, message: '请输入告警源端口！', trigger: 'change' }]"
          label="告警源端口"
          prop="port"
        >
          <a-input-number v-model="formState.port" style="width: 200px" />
        </a-form-model-item>
        <a-form-model-item
          extra="针对未关闭的告警，以监控工具最后一次发出告警事件为准，如果设定的时间内未进行手动关闭告警，系统将自动为您关闭告警；自定义区间范围：0-1440分钟，0表示永不关闭，1440分钟即为24小时。"
          label="自动关闭"
          :rules="[{ required: formState.autoClose, message: '请配置自动关闭时间！', trigger: 'change' }]"
          prop="autoCloseInterval"
        >
          <a-input-number
            :min="0"
            :max="1440"
            v-show="formState.autoClose"
            v-model="formState.autoCloseInterval"
            style="width: 100px">
          </a-input-number>
          <span v-show="formState.autoClose">分钟后自动关闭</span>
          <a-switch :checked="formState.autoClose" @change="onAutoCloseChange"/>
        </a-form-model-item>
        <a-form-model-item
          extra="规则说明：同一应用且EVENT_ID相同且级别相同；同一个告警源且告警名称相同级别相同的告警数据会被实时压缩成一条数据。最新的数据会覆盖历史数据，记录最新发生时间和发生频次。"
          label="开启自动去重"
        >
          <a-switch :checked="formState.autoGroup" @change="onDedupChange"/>
        </a-form-model-item>
        <a-form-model-item
          extra="同一告警源在选定时间内将压缩依据内容相同的告警数据压缩成一条数据"
          label="压缩告警"
          :rules="[{ required: formState.compress, message: '请配置压缩告警范围！', trigger: 'change' }]"
          prop="compressDuration"
        >
          <a-select
            v-show="formState.compress"
            v-model="formState.compressDuration"
            style="width: 200px">
            <a-select-option :value="'5'">压缩5分钟告警</a-select-option>
            <a-select-option :value="'10'">压缩10分钟告警</a-select-option>
          </a-select>
          <a-switch :checked="formState.compress" @change="onCompressChange"/>
        </a-form-model-item>
        <a-form-model-item
          extra="当告警事件严重程度达到指定级别以后，需同时通知给相应领导，且值班人员需要对告警进行认领"
          label="开启认领"
          :rules="[{ required: formState.claim, message: '请配置认领级别！', trigger: 'change' }]"
          prop="claimLevel"
        >
          <a-select v-show="formState.claim" v-model="formState.claimLevel" style="width: 200px" :options="options">
          </a-select>
          <a-switch :checked="formState.claim" @change="onReclaimChange"/>
        </a-form-model-item>
        <a-form-model-item
          extra="默认关闭，开启后需要配置监控时长，间隔时间内没有告警接入，将提醒选择的用户。时间范围：1~24小时，建议设置5小时以上更为合适"
          label="开启自监控"
          :rules="[{ required: formState.monitor, message: '请配置监控时长！', trigger: 'change' }]"
          prop="monitorInterval"
        >
          <a-input-number
            :min="1"
            :max="24"
            v-show="formState.monitor"
            v-model="formState.monitorInterval"
            style="width: 180px">
          </a-input-number>
          <span v-show="formState.monitor">小时</span>
          <a-switch :checked="formState.monitor" @change="onSelfChange"/>
        </a-form-model-item>
        <a-form-model-item
          :rules="[{ required: true, message: '请输入告警源URL！', trigger: 'change' }]"
          label="告警URL"
          prop="url"
        >
          <a-input v-model="formState.url" style="width: 300px" />
        </a-form-model-item>
        <a-form-model-item
          v-if="isAdmin"
          :rules="[{ required: isAdmin, message: '请选择通知组！', trigger: 'change' }]"
          label="通知组"
          prop="groupId"
        >
          <a-select v-model="formState.groupId" style="width: 200px" :options="groupData"/>
        </a-form-model-item>
      </a-form-model>
      <div class="jsonContent" v-if="current === 1">
        <div class="originalJson">
          <h3>请输入JSON数据</h3>
          <textarea style="height: 400px;width: 60%" v-model="jsonContent"></textarea>
          <div>
            <a-button type="primary" @click="translateJson">解析</a-button>
          </div>
        </div>
        <div class="jsonResult">
          <h3>解析结果</h3>
          <textarea style="height: 400px;width: 60%" v-model="jsonResult" disabled></textarea>
        </div>
      </div>
      <div class="jsonMapping" v-if="current === 2">
        <a-form-model
          :label-col="{ span: 4 }"
          :model="mappingForm"
          :wrapper-col="{ span: 20 }"
          autocomplete="off"
          ref="basic"
          style="margin-top: 30px"
        >
          <a-form-model-item
            v-for="(item,index) in Object.keys(mappingForm)"
            :label="mappingTitle[index]"
            :key="index"
            :rules="[{ required: item === 'uniqueKey' || item === 'event_id', message: '该项必须配置！', trigger: 'change' }]"
            :prop="item"
          >
            <a-select v-model="mappingForm[item]" style="width: 200px" :options="jsonOptions"/>
            <span v-show="formState.compress && (compressFlags[index] || !compressFlags.includes(true))">
              <a-divider type="vertical"/>
              <a-checkbox @change="compressChange(index)">
                作为压缩依据
              </a-checkbox>
            </span>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        上一步
      </a-button>
      <a-button v-if="current < 2" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current === 2"
        type="primary"
        @click="onSubmit"
      >
        提交
      </a-button>
    </div>
  </div>

</template>

<script>
import store from '@/store/index'
import { alarm } from '@/utils/request'

export default {
  name: 'AlertSourceForm',
  components: {},
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    platform: {
      type: String,
      default: '302455444528566272'
    }
  },
  data () {
    return {
      compressFlags: [],
      typeObj: {
        'uniqueKey': 'string',
        'device': 'string',
        'title': 'string',
        'content': 'string',
        'level': 'string',
        'startTime': 'struct',
        'lastTime': 'struct',
        'deviceType': 'string'
      },
      formState: {
        groupId: '',
        name: '',
        ip: '',
        port: 3000,
        autoClose: false,
        autoCloseInterval: 0,
        claim: false,
        claimLevel: '',
        autoGroup: true,
        compress: false,
        compressDuration: true,
        monitor: false,
        monitorInterval: 0,
        url: ''
      },
      current: 0,
      jsonContent: '',
      data: [],
      jsonOptions: [],
      options: [
        {
          value: '1',
          label: 'L1'
        },
        {
          value: '2',
          label: 'L2'
        },
        {
          value: '3',
          label: 'L3'
        },
        {
          value: '4',
          label: 'L4'
        },
        {
          value: '5',
          label: 'L5'
        }
      ],
      mappingForm: {
        uniqueKey: '',
        level: '',
        content: '',
        title: '',
        device: '',
        startTime: '',
        lastTime: '',
        deviceType: ''
      },
      jb: null,
      isAdmin: false,
      titleMapping: {
        'uniqueKey': '唯一标识符',
        'device': '告警设备',
        'title': '告警标题',
        'content': '告警内容',
        'level': '告警级别',
        'event_id': '事件id',
        'device_type': '设备类别'
      },
      mappingTitle: [
        '标识唯一值',
        '告警设备',
        '告警标题',
        '告警内容',
        '事件Id',
        '告警级别',
        '开始报警时间',
        '最近报警时间',
        '设备类别'
      ],
      groupData: []
    }
  },
  methods: {
    translateJson () {
      if (!this.jsonContent.length) {
        this.$message.warn('请输入JSON数据！')
        return
      }
      let JsonBody = null
      try {
        JsonBody = JSON.parse(this.jsonContent)
      } catch (e) {
        this.$message.warn('输入的JSON数据有误！请检查后再试！')
      }
      this.jb = JsonBody
      this.data = Object.keys(JsonBody)
      this.jsonOptions = []
      this.data.forEach(j => {
        this.jsonOptions.push({
          value: j,
          label: j
        })
      })
    },
    next () {
      if (this.current === 0) {
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
      } else if (this.current === 1 && this.data.length < 1) {
        this.$message.warn('解析结果为空！请检查您的操作是否有误！')
        return
      }
      this.current++
    },
    prev () {
      this.current--
    },
    onFinish (values) {
      console.log('Success:', values)
    },

    onFinishFailed (errorInfo) {
      console.log('Failed:', errorInfo)
    },
    onAutoCloseChange (flag) {
      this.formState.autoClose = flag
      // console.log('Failed:', flag)
    },
    onReclaimChange (flag) {
      this.formState.claim = flag
      // console.log('Failed:', flag)
    },
    onDedupChange (flag) {
      this.formState.autoGroup = flag
      // console.log('Failed:', flag)
    },
    onCompressChange (flag) {
      this.formState.compress = flag
      this.$forceUpdate()
      // console.log('Failed:', flag)
    },
    onSelfChange (flag) {
      this.formState.monitor = flag
      // console.log('Failed:', flag)
    },
    compressChange (index) {
      console.log(index)
      console.log(this.compressFlags[index])
      this.compressFlags[index] = !this.compressFlags[index]
      this.$forceUpdate()
    },
    async onSubmit () {
      let flag = false
      this.$refs.basic.validate(valid => {
        if (!valid) {
          flag = true
          this.$message.error('请检查您的表单项是否都填写完毕！')
        }
      })
      if (this.formState.compress && !this.compressItem) {
        this.$message.error('压缩依据必选！')
      }
      if (flag) {
        return
      }
      const alertMapping = []
      Object.keys(this.mappingForm).forEach((m, index) => {
        if (this.mappingForm[m] && this.mappingForm[m] !== '') {
          if (m === 'uniqueKey') {
            alertMapping.push({
              'sourceField': this.mappingForm[m],
              'targetField': m,
              'targetType': this.typeObj[m],
              remark: this.jb[this.mappingForm[m]]
            })
          } else if (this.formState.compress && index === this.compressFlags.indexOf(true)) {
            alertMapping.push({
              'sourceField': this.mappingForm[m],
              'targetField': m,
              'targetType': this.typeObj[m],
              'compressCondition': true,
              'compressSequence': 1
            })
          } else {
            alertMapping.push({
              'sourceField': this.mappingForm[m],
              'targetField': m,
              'targetType': this.typeObj[m]
            })
          }
        }
      })
      this.formState.port = this.formState.port.toString()
      if (this.formState.monitor) {
        this.formState.monitorInterval = this.formState.monitorInterval.toString()
      } else {
        delete this.formState.monitorInterval
      }
      if (this.formState.autoClose) {
        this.formState.autoCloseInterval = this.formState.autoCloseInterval.toString()
      } else {
        delete this.formState.autoCloseInterval
      }
      if (this.formState.compress) {
        this.formState.compressDuration = this.formState.compressDuration.toString()
      } else {
        delete this.formState.compressDuration
      }
      const sourceData = { ...this.formState, platformId: this.platform, sampleData: this.jsonContent }
      let requestAddress = '/api/integration/source/add'
      if (this.record && this.record !== {}) {
        requestAddress = '/api/integration/source/update'
      }
      try {
        const res = await alarm.post(requestAddress, { sourceData, alertMapping })
        if (res.code === 200) {
          this.$message.success(res.msg)
          await this.$router.push('platform')
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    async getMappingData () {
      try {
        const { data } = await alarm.get('/api/integration/source/preadd')
        const Obj = {}
        const form = {}
        const titles = []
        const compressFlags = []
        data.forEach(d => {
          Obj[d.fieldName] = d.fieldType
          form[d.fieldName] = ''
          titles.push(this.titleMapping[d.fieldName])
          compressFlags.push(false)
        })
        this.typeObj = Obj
        this.mappingForm = form
        this.mappingTitle = titles
        this.compressFlags = compressFlags
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    async getGroupData () {
      if (!this.isAdmin) {
        return
      }
      try {
        const { data } = await alarm.get('/api/configuration/group/getUnbindSourceGroup')
        const arr = []
        data.forEach(d => {
          arr.push({
            label: d.groupName,
            value: d.groupId
          })
        })
        this.groupData = arr
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    initialData () {
      const user = store.getters.userId
      this.isAdmin = user === 'administrator'
      if (this.record && this.record !== {}) {
        const { sampleData, ...states } = this.record
        this.formState = { ...states }
        this.jsonContent = sampleData
        this.isAdmin = false
      }
      this.getMappingData()
      this.getGroupData()
    }
  },
  computed: {
    compressOne: {
      get (index) {
        return function () {
          return this.formState.compress && (this.compressFlags[index] || !this.compressFlags.includes(true))
        }
      }
    },
    jsonResult () {
      let content = ''
      this.data.forEach(element => {
        content += element + '\n'
      })
      return content
    }
  },
  mounted () {
    this.initialData()
  }
}
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}
.jsonContent{
  display: flex;
}
.originalJson{
  width: 45%;
  text-align: center;
}
.jsonResult{
  width: 45%;
  text-align: center;
}
</style>
