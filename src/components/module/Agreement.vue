<template>
  <div class="checkBox" ref="isShow">
    <yd-checkbox v-model="checkbox" :required="required" color="#2191a2">
      <span v-html="label"></span>
    </yd-checkbox>
    <span v-for="item in optionsM">
      <a :name="item.href" v-text="item.name" @click="getIframe($event)"></a>
    </span>
    <div v-show="isShow" class="iframeDiv" id="iframeDiv">
      <iframe :src="iframeSrc" frameborder="0"></iframe>
    </div>
    <img v-if="imgShow" class="iframeDivImg" src="/static/img/icon_X.png" alt="" @click="closeIframe">
  </div>
</template>
<script>
  import Vue from 'vue';
  import Hub from '../../js/hub'
  export default {
    data() {
      return {
        checkbox:this.checked,
        category:'',
        optionsM:[],
        iframeSrc:'',
        isShow:false,
        imgShow:false,
      }
    },
    props:['label','required','checked','options'],
    mounted(){
      const self = this;
//      document.getElementById('iframeDiv').addEventListener('touchmove', function (event) {
//        event.preventDefault();
//      }, false);
      for(let i = 0;i<self.options.length;i++){
        if((self.options[i].url).indexOf('+')>0){
          self.options[i].href = self.options[i].url.split('+')[0]+self.category+self.options[i].url.split('+')[2];
        }else{
          self.options[i].href = self.options[i].url;
        }
      }
      self.optionsM = self.options;
     
      Hub.$on('change',function(msg){
        self.category = msg.value;
      })
      
    },
    methods:{
      getIframe(obj){
        const self = this;
        if(obj.target.name.indexOf('_')<0||!(obj.target.name.split('_')[1]).match(/^\./)){      // 如果url无下划线或者下划线后不以.开头则是有协议的，直接显示。
          self.iframeSrc = obj.target.name+'?version=1.2';
          self.isShow = true;
          self.imgShow = true;
        }else{
          self.$dialog.alert({mes:'请先选择品类'});
        }
      },
      closeIframe(){
        this.isShow = false;
        this.imgShow = false;
      }
    },
    watch:{
      'checkbox':function(){
        this.$emit('transferData',{checkbox:this.checkbox});
      },
      'category':function (){
        const self = this;
        for(let i = 0;i<self.options.length;i++){
          if((self.options[i].url).indexOf('+')>0){
            Vue.set(self.optionsM, i, {'name':self.options[i].name,'url':self.options[i].url,'href':self.options[i].url.split('+')[0]+self.category+self.options[i].url.split('+')[2]});
          }else{
            self.options[i].href = self.options[i].url;
          }
        }
        self.optionsM = self.options;
      }
    }
  }
</script>
