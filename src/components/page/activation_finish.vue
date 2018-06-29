<template>
  <div class="wrapper activation_finish">
    <div class="logo">
      <img src="/static/img/pic_ok.png">
    </div>
    <div class="title_center">您的赠险已成功激活！</div>
    <div class="button_div" v-if="showButton">
      <button class="btn_base" @click="openOrderDetail()">查看我的赠险</button>
    </div>
  
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showButton:true,
      }
    },
    mounted(){
      if(sessionStorage.getItem('source') === 'H5'){
        this.showButton = false;
      }else{}
    },
    methods:{
      openOrderDetail(){
        const self = this;
        let orderId = sessionStorage.getItem('orderId');
        self.$router.push({path:'/orderDetail/'+orderId});
      }
    }
  }
</script>
