<template>
  <div>
    <img :src='src' width="100%">
  </div>
</template>
<script>
  export default {
    data () {
      return {
        src:'',
      }
    },
    mounted(){
      const self = this;
      self.openid = self.getUrlKey("openid");
      self.$api.get('/bnhWechat/noWorryPaymentOfClaims',{openid:self.openid},null,r=>{
        if(r.code==='200'){
          if(r.data === 'jinPeng'){
            self.src = '/static/img/default/jp.jpg';
          }else if(r.data === 'zongShen'){
            self.src = '/static/img/default/zs.jpg';
          }else if(r.data === 'default'){
            self.src = '/static/img/default/1.jpg';
          }
        }else{
          self.$dialog.alert({mes:r.message});
        }
      })
    }
  }
</script>
