<template>
  <div class="wrapper back_bg">
    <div class="banner_logo">
      <img src="/static/img/banner.png">
    </div>
    <div class="login">
      <!--<form method="post" class="login_form">-->
        <div class="login_div">
          <div class="input_list">
            <yd-cell-item>
              <span slot="left">
                  <img class="phone_logo" src="/static/img/login_phone.png">
              </span>
              <yd-input slot="right" type="number" v-model="input_phone" regex="mobile" ref="input_phone" required :show-clear-icon="false" :show-required-icon="false" class="cell-input" placeholder="请输入手机号码"></yd-input>
            </yd-cell-item>
          </div>
          <div class="input_list">
            <yd-cell-item>
              <span slot="left">
                  <img class="phone_logo" src="/static/img/login_code.png">
              </span>
              <yd-input slot="right" class="cell-input" v-model="input_code" regex="^[0-9]+$" ref="input_code" required :show-clear-icon="false" :show-required-icon="false" placeholder="请输入验证码"></yd-input>
              <yd-sendcode slot="right" v-model="start" class="base_btn base_bg" @click.native="sendCode()" run-str="{%s}s"  init-str="获取验证码" reset-str="重新获取"></yd-sendcode>
            </yd-cell-item>
          </div>
        </div>
        
        <div class="button_div">
          <button class="btn_base" @click ="next_btn">登录</button>
        </div>
        <!--<div class="check_div">-->
          <!--<yd-checkbox v-model="checkbox" size="15" color="#2191A2">&nbsp;&nbsp;我已阅读并同意《用户服务协议什马金融》</yd-checkbox>-->
        <!--</div>-->
      <!--</form>-->
      <!--<div class="footer">-->
        <!--<img src="/static/img/icon_service.png" alt="icon_contect"/>-->
        <!--<a class="silver" href="tel:400-088-6177">&nbsp;联系客服&nbsp;400-088-6177</a>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="text/babel">
  export default{
    data (){
      return {
        start:false,  // 发送验证码
        input_phone:'',  // 手机号
        input_code:'',  // 验证码
        checkbox: true,
        openid:'',
      }
    },
    mounted(){
      const self= this;
      self.openid = sessionStorage.getItem('openid');
    },
    methods:{
      sendCode() {
        const self = this;
        if(self.$refs.input_phone.valid){
          self.$dialog.loading.open('发送中...');
//          let params={
//            phone:self.input_phone
//          }
          let formData = new FormData();
          formData.append('phone',self.input_phone);
          self.$api.post('/bnhWechat/getProveCode',{'openid':self.openid},formData,r =>{
            if(r.code === '200'){
              self.start = true;
              self.$dialog.loading.close();
              self.phoneValue = r.data.paramValue;
              setTimeout(() => {
                self.$dialog.toast({
                  mes: '已发送',
                  icon: 'success',
                  timeout: 1500
                });
              }, 1000);
            }else{
              self.$dialog.alert({mes:r.message});
            }
          })
        }else{
          self.$dialog.alert({mes:'请先输入手机号'});
//          this.$refs.input_phone.setFocus();
        }
      },
      next_btn() {                // 登录验证
        const self = this;
        if(self.$refs.input_phone.valid && self.$refs.input_code.valid){
          sessionStorage.setItem('phone',self.input_phone);
          self.$dialog.loading.open('正在登录中...');
          let formData = new FormData();
          formData.append('phone',self.input_phone);
          self.$api.post('/bnhWechat/login',{'openid':self.openid,'VAILD_CODE_KEY':self.phoneValue,'VAILD_CODE_VALUE':self.input_code},formData,r => {             // 登录
            if (r.code === '200') {
              self.$dialog.loading.close();
              self.$router.push({path:'/orderList'});
            } else {
              self.$dialog.alert({mes: r.message});
            }
            self.$dialog.loading.close();
          })
        }else{
          if(!self.$refs.input_phone.valid){
            const phoneMsg = self.$refs.input_phone.errorMsg;
            self.$dialog.alert({mes:'手机号'+phoneMsg});
//            self.$refs.input_phone.setFocus();
          }else{
            const codeMsg = self.$refs.input_code.errorMsg;
            self.$dialog.alert({mes:'验证码'+codeMsg});
//            self.$refs.input_code.setFocus();
          }
          
        }
        
      }
    }
  }
</script>
