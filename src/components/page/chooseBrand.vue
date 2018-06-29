<template>
	<div class="brandContent">
    <div class="top_title">
      <Title :title="title"></Title>
    </div>
    <div class="chooseBrand">
      <span class="brand" :class="{'oddBrand':isOdd}" @click="checkBrand(index)" v-for="(item,index) in brandArr">
        <router-link :to="'/main/' + item.id">
          <span v-text="item.name" :class="{'active':index===isActive}"></span>
        </router-link>
      </span>
    </div>
	</div>
</template>
<script>
  import Title from '../module/Title.vue';
  export default {
    data() {
      return {
        title:'请选择我的品牌',
        brandArr:[],
        isOdd:false,   // 是否是奇数
        isActive:-1,
        openid:'',
      }
    },
    components:{
      Title
    },
    mounted(){
      const self = this;
      self.openid = self.getUrlKey("openid");
      self.source = self.getUrlKey("source");
      sessionStorage.setItem('openid',self.openid);
      sessionStorage.setItem('source',self.source);
      sessionStorage.setItem('brandUrl',location.href);
      self.$api.get('/bnhWeichart/brand/wechat/supported',{'openid':self.openid},null,r=>{
//      self.$api.get('https://easy-mock.com/mock/5a12764bef842836ae773582/code/bnhWeichart/brand',null,r=>{
        if(r.code === 200){
          self.brandArr = r.data;
          if(self.brandArr.length%2 !== 0 || self.brandArr.length >= 9){
            self.isOdd = true;
          }
        }else{
          self.$dialog.alert({mes:r.message});
        }
      })
    },
    methods:{
      checkBrand(index){
        const self = this;
        self.isActive = index;
//        console.log(this.brandArr[index].id);
//        self.$api.post('',self.brandArr[index].id,r=>{
//          if(r.code === 200){
//            self.$router.push({path:'/page/main'});
//          }else{
//            self.$dialog.alert({mes:r.message});
//          }
//        })
      }
    },
  }
</script>
