<template>
  <div>
    <a-modal
      :visible="otpQrVisible"
      :confirm-loading="confirmLoading"
      :footer="footer"
      @cancel="otpBindCancel"
      title="注册"
      :width="saoWidth">
      <span style="display: block;font-size: 10px;font-size: 17px;font-weight: 600;">请使用微信小程序E登录扫码绑定用户，并输入OTP码</span>
      <div id="otpBindingQr" class="qrcode_img" :style="{'margin-top':'20px'}"/>
      <a-form-model
        ref="ruleForm"
        :model="otpAckForm">
        <a-form-model-item ref="thirdAccountRemarks" label="OTP码" prop="code">
          <a-input
            v-model="otpAckForm.code"
          />
        </a-form-model-item>
        <a-form-model-item :style="{'justify-content':'center','display':'flex','align-items':'center'}">
          <a-button type="primary" @click="otpAckSubmit">
            确认
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import axios from 'axios'
export default {
  props: [],
  components: {
  },
  data () {
    return {
      otpQrVisible: false,
      otpAckForm: {
        remark: '',
        code: ''
      },
      otpBinding: {
        id: '',
        remark: '',
        uri: '',
        src: undefined,
        otpQr: undefined
      },
      confirmLoading: false,
      footer: null,
      saoWidth: 450
    }
  },
  created () {
  },
  methods: {
    otpBind (params) {
      this.otpAckForm.bindingid = ''
      this.otpAckForm.code = ''
      this.otpAckForm.remark = ''
      this.otpAckForm.appId = params.appId
      this.otpAckForm.transNo = params.transNo
      axios.post('/otp/reg', {
        type: 'TOTP',
        ...params
      }, {
        baseURL: process.env.VUE_APP_OTP_BASE_URL
      }).then(res => {
        if (res.data.statusCode === 1200) {
          this.otpAckForm.bindingid = res.data.id
          this.otpQrVisible = true
          this.$nextTick(function () {
            if (this.otpBinding.otpQr !== undefined) {
              this.otpBinding.otpQr.makeCode(res.data.otpuri)
            } else {
              this.otpBinding.otpQr = new QRCode('otpBindingQr', {
                width: 400,
                height: 400,
                text: res.data.otpuri
              })
            }
          })
          // show qr must in nextTick , don't know why
        } else {
          this.$notification.error({
            message: '系统提示',
            description: res.data.description
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    otpBindCancel () {
      this.otpQrVisible = false
      this.$emit('close')
    },
    otpAckSubmit () {
      axios.post('/otp/ack', {
        verifyCode: this.otpAckForm.code,
        id: this.otpAckForm.bindingid,
        appId: this.otpAckForm.appId,
        transNo: this.otpAckForm.transNo
      }, {
        baseURL: process.env.VUE_APP_OTP_BASE_URL
      }).then(res => {
        if (res.data.statusCode === 1200) {
          this.$emit('otpSuccess')
          this.otpQrVisible = false
          this.$notification.success({
            message: '系统提示',
            description: '添加成功'
          })
        } else {
          this.$notification.error({
            message: '系统提示',
            description: res.data.description
          })
        }
      }).catch(function (error) {
        this.$emit('optError')
        console.log(error)
      })
    }
  }
}
</script>
