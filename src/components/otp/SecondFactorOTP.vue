<template>
  <div>
    <a-modal
      :width="350"
      title="请输入E登录产生的动态令牌"
      :visible="show"
      :closable="false"
      :maskClosable="false"
      centered="true"
    >
      <template slot="footer">
        <a-button type="primary" @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确认</a-button>
      </template>
      <a-form
        :form="form"
      >
        <a-form-item style="margin-bottom: 0;">
          <a-input
            v-decorator="['password',{rules: validatorRules.password.rules}]"
            size="middle"
            type="password"
            autocomplete="false"
            placeholder="动态码输入">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      show: false,
      userinfo: { username: '', password: '', email: '', phone: '' },
      validatorRules: {
        password: { rules: [{ required: true, message: '请输入动态码!', validator: 'click' }] }
      },
      params: {}
    }
  },
  created () {
  },
  methods: {
    onShow (params) {
      this.show = true
      this.params = params
    },
    handleCancel () {
      this.show = false
      this.$emit('close')
    },
    handleSubmit () {
      const that = this
      const loginParams = {}
      that.form.validateFields(['password'], { force: true }, (err, values) => {
        if (!err) {
          loginParams.userName = this.userinfo.username
          loginParams.verifyCode = values.password
          axios.post('/otp/verify', {
            ...this.params,
            verifyCode: loginParams.verifyCode
          }, {
            baseURL: process.env.VUE_APP_OTP_BASE_URL
          }).then(data => {
            if (data.data.statusCode === 1200) {
              this.$emit('loginSuccess')
              this.handleCancel()
            } else {
              this.$notification.error({
                message: '系统提示',
                description: data.data.description
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
