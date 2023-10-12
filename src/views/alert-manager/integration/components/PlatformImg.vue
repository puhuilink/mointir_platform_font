<template>
  <a-badge :count="count" color="#01d7b0">
    <a-card hoverable style="width: 100px" :bordered="false">
      <template #cover>
        <img
          :src="baseUrl+img"
          width="60px"
          height="60px"
          style="margin: 5px"
          id="platformImg"
          @click="openModal(id)"/>
      </template>
      <template #actions>
        <a-icon type="plus" key="edit" style="color: #3c9be8" @click="toCreateAlertSource(id)" />
      </template>
    </a-card>
    <a-modal
      title="修改接入平台"
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="1000px"
      @ok="handleOk"
      @cancel="closeModal"
    >
      <a-form-model ref="ruleForm" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item
          label="接入平台标识"
          :rules="[{ required: true, message: '请上传图片！', trigger: 'change' }]"
          prop="file">
          <a-input style="width: 80%" v-model="formState.file" disabled/>
          <a-upload :file-list="fileList" @change="handleUploadChange" :before-upload="()=>false" :remove="handleRemove" ><a-button style="margin-left:5px "> <a-icon type="upload"/>上传</a-button></a-upload>
        </a-form-model-item>
        <a-form-model-item
          label="接入平台名称"
          :rules="[{ required: true, message: '请输入接入平台名称！', trigger: 'change' }]"
          prop="name">
          <a-input v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="接入平台描述">
          <a-textarea v-model="formState.remark" />
        </a-form-model-item>
        <a-form-model-item
          label="监控级别对应关系"
          :rules="[{ required: true, validator: relationPass, trigger: 'change' }]"
          prop="levelRelation">
          <a-table
            :columns="mappingColumns"
            :data-source="formState.levelRelation"
            :pagination="false"
            bordered
            :row-key="(record)=>record.key">
            <template
              v-for="col in ['P1', 'P2']"
              :slot="col"
              slot-scope="text,record"
            >
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record,index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="save(record.key)">保存</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定取消吗?" @confirm="() => cancel(record.key)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="() => edit(record.key)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="() => removeOne(index)">删除</a>
                </span>
              </div>
            </template>
          </a-table>
          <center><a-button @click="()=>addRecord()"><a-icon type="plus"/></a-button></center>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <canvas id="demoCanvas" v-show="false"></canvas>
  </a-badge>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
import { alarm } from '@/utils/request'
import _ from 'lodash'
const original = {
  id: '',
  file: '',
  name: '',
  remark: '',
  levelRelation: []
}
export default {
  name: 'PlatformImg',
  components: { SvgIcon },
  props: {
    platType: {
      type: String,
      default: '1'
    },
    svgName: {
      type: String,
      default: 'pigoss'
    },
    id: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    alertSourceCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    const name = 'svg-' + this.svgName
    const count = this.alertSourceCount
    const baseUrl = process.env.VUE_APP_VIEW_THUMBNAIL_URI
    return {
      name,
      baseUrl,
      count,
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      visible: false,
      confirmLoading: false,
      formState: { ..._.cloneDeep(original) },
      fileList: []
    }
  },
  methods: {
    relationPass (rule, value, callback) {
      let flag = value.length < 1
      value.forEach(va => {
        if (flag) {
          return true
        }
        flag = va.P1 === '' || va.P2 === ''
      })
      if (flag) {
        callback(new Error('请检查您填写的监控级别对应关系！'))
      } else {
        callback()
      }
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    handleUploadChange (file) {
      this.formState.file = file.file.name
      this.fileList[0] = file.file
      console.log('list', this.fileList)
    },
    async openModal (id) {
      try {
        const { data } = await alarm.post('/api/integration/platform/find', { platformId: id })
        this.getFile(this.baseUrl + data.url, (res) => {
          this.handleUploadChange({ file: res })
        })
        this.formState.id = id
        this.formState.name = data.name
        this.formState.remark = data.remark
        const arr = []
        Object.keys(data.levelRelation).forEach(l => {
          arr.push(
            {
              P1: l,
              P2: data.levelRelation[l],
              key: arr.length.toString()
            }
          )
        })
        this.formState.levelRelation = arr
        // console.log(this.base64ToFile(this.imagetoCanvas(imgEntity)))
      } catch (e) {
        console.log(e)
        this.$message.error('请求失败！请检查网络连接！')
        return
      }
      this.visible = true
    },
    closeModal () {
      this.visible = false
      this.fileList = []
      this.$refs.ruleForm.resetFields()
      this.formState = _.cloneDeep(original)
    },
    getFile (url, cb) {
      const imgEntity = new Image()
      imgEntity.src = url
      const that = this
      imgEntity.onload = function () {
        const base64 = that.imageToBase64(imgEntity)
        const file = that.base64ToFile(base64, '标识图片')
        cb && typeof cb === 'function' && cb(file)
        return file
      }
    },
    addRecord () {
      this.formState.levelRelation.push(
        {
          P1: '等级',
          P2: '值',
          key: (Math.random() * this.formState.levelRelation.length + 1).toString()
        }
      )
      this.$forceUpdate()
    },
    imageToBase64 (img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/jpeg' + ext)
      return dataURL
    },
    base64ToFile (urlData, fileName) {
      const arr = urlData.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bytes = atob(arr[1]) // 解码base64
      let n = bytes.length
      const ia = new Uint8Array(n)
      while (n--) {
        ia[n] = bytes.charCodeAt(n)
      }
      return new File([ia], fileName, { type: mime })
    },
    removeOne (index) {
      // console.log(this.editingKey)
      if (this.editingKey !== '' && this.editingKey) {
        return
      }
      // console.log('prv', this.formState.levelRelation)
      this.formState.levelRelation.splice(index, 1)
      // console.log('suf', this.formState.levelRelation)
      this.$forceUpdate()
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
      this.confirmLoading = true
      const formData = new FormData()
      const relation = {}
      this.formState.levelRelation.forEach(level => {
        relation[level.P1] = level.P2
        delete level.key
      })
      formData.append('name', this.formState.name)
      formData.append('id', this.formState.id)
      formData.append('remark', this.formState.remark)
      formData.append('levelRelation', JSON.stringify(relation))
      formData.append('platType', this.platType)
      formData.append('file', this.fileList[0], 'old.png')

      let res
      try {
        res = await alarm.post('/api/integration/platform/update', formData)
      } catch (e) {
        res = e.response.data
      } finally {
        this.confirmLoading = false
      }
      if (res.code === 200) {
        this.$message.success('修改成功！')
        this.$emit('refresh')
      } else {
        this.$message.error(res.data)
      }
      this.closeModal()
    },
    handleChange (value, key, column) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.formState.levelRelation = newData
      }
    },
    edit (key) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.formState.levelRelation = newData
      }
      this.$forceUpdate()
    },
    save (key) {
      console.log(key)
      const newData = [...this.formState.levelRelation]
      const newCacheData = [...this.cacheData]
      const target = newData.find(item => key === item.key)
      console.log('target', target)
      const targetCache = newCacheData.find(item => key === item.key)
      console.log('cache', targetCache)
      if (target && targetCache) {
        delete target.editable
        this.formState.levelRelation = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel (key) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.key))
        delete target.editable
        this.formState.levelRelation = newData
      }
    },
    async toCreateAlertSource (id) {
      let pp
      try {
        const { data } = await alarm.post('/api/integration/platform/display', { platformId: id })
        pp = data
      } catch (e) {
        this.$message.error('请求失败！请检查网络连接！')
        return
      }
      pp.url = this.baseUrl + pp.url
      pp.id = id
      await this.$router.push({ name: 'NewAlertSource', query: { plat: pp } })
    }
  },

  computed: {
    cacheData () {
      return this.formState.levelRelation.map(item => ({ ...item }))
    },
    mappingColumns () {
      return [
        {
          title: this.formState.name,
          dataIndex: 'P2',
          width: '30%',
          scopedSlots: { customRender: 'P2' }
        },
        {
          title: '统一监控平台',
          dataIndex: 'P1',
          width: '30%',
          scopedSlots: { customRender: 'P1' }
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  }
}
</script>

<style scoped></style>
