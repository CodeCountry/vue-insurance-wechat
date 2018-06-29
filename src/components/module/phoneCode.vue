<template>
  <!--获取验证码-->
  <div class="model">
    <div class="model_content">
      <div class="model_top">
        <i @click="fadeOut_model"></i>
        <p class="title">验证投保手机</p>
        <div class="model_input">
          <div class="input_code input_phone">
            <yd-input v-model="input_phone" type="number" regex="mobile" ref="input_phone" :show-clear-icon="false" required :show-required-icon="false" placeholder="请输入手机号码"></yd-input>
          </div>
        </div>
        <div class="model_input">
          <div class="left input_code">
            <div class="sendCode">验证码已发送</div>
            <!--<input type="text" placeholder="请输入验证码" v-model="input_code" ref="input_code" id="valid_code" class="yd-input"/>-->
            <yd-input id="valid_code" v-model="input_code" ref="input_code" regex="^[0-9]+$" required :show-clear-icon="false" :show-error-icon="false" :show-required-icon="false" placeholder="请输入验证码"></yd-input>
          </div>
          <div class="left code_div">
            <yd-sendcode id="getCode" v-model="start" @click.native="sendCode()" run-str="{%s}s"  init-str="获取验证码" reset-str="重新获取"></yd-sendcode>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="model_bottom" @click="sure_btn()">
        <button class="model_btn">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        start:false,  // 发送验证码
        input_phone:'',
        input_code:'',
      }
    },
    mounted(){
      this.openid = sessionStorage.getItem('openid');
    },
    methods:{
      fadeOut_model(){
        this.$emit('transferFun',false);
      },
      // 获取验证码
      sendCode() {
        const self = this;
        if(self.$refs.input_phone.valid){
          self.$dialog.loading.open('发送中...');
          let formData = new FormData();
          formData.append('phone',self.input_phone);
          self.$api.post('/bnhWechat/getProveCode',{openid:self.openid},formData,r =>{
            if(r.code === '200'){
              self.start = true;
              self.key = r.data.paramKey;
              self.value = r.data.paramValue;
              self.$dialog.loading.close();
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
      sure_btn(){
        const self = this;
        if(self.$refs.input_phone.valid && self.$refs.input_code.valid){
          self.$dialog.loading.open('请稍等...');
          self.$emit('transferData',{phone:self.input_phone,code:self.input_code,key:self.key,value:self.value});
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
