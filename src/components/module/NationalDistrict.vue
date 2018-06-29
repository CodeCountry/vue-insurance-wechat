<template>
  <div>
    <yd-cell-item arrow>
      <span slot="left">{{label}}</span>
      <yd-input slot="right" id="Address" :required="required" readonly :show-required-icon="false" v-model="modelValue" max="20" :placeholder="placeholder"></yd-input>
    </yd-cell-item>
  </div>
</template>
<script>
  import MobileSelect from 'mobile-select';
  import {getCity} from '../../js/city.js';
  export default {
    data() {
      return {
        modelValue:'',
        model:''
      }
    },
    props:['label','placeholder','required'],    // 父组件传值到子组件
    mounted() {
      const self = this;
      new MobileSelect({
        trigger: '#Address',
        title: '选择地区',
        wheels: [
          {data: getCity()}
        ],
        position:[0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
        callback:function(indexArr, data){
          self.$emit('transferParamSelect',{province:data[0].value,city:data[1].value,district:data[2].value});
        }
      });
      
      
    }
  }
</script>
