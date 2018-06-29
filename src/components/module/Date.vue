<template>
  <div>
    <yd-cell-item arrow>
      <span slot="left">{{label}}</span>
        <yd-input slot="right" id="Date" :required="required" readonly :show-required-icon="false" v-model="modelValue" max="20" :placeholder="placeholder"></yd-input>
    </yd-cell-item>
  </div>
</template>
<script>
  import MobileSelect from 'mobile-select';
  import {getDate} from '../../js/date.js';
  export default {
    data() {
      return {
        modelValue:'',
      }
    },
    props:['model','label','placeholder','required'],    // 父组件传值到子组件
    mounted() {
      const self = this;
      let now_month = new Date().getMonth();
      let now_date = new Date().getDate();
      new MobileSelect({
        trigger: '#Date',
        title: '选择日期',
        wheels: [
          {data: getDate()}
        ],
        position:[0,now_month,now_date-1], //初始化定位 打开时默认选中的哪个 如果不填默认为0
        callback:function(indexArr, data){
          // 将日期转为yyyy-mm-dd格式。
          self.modelValue = (data[0].value+data[1].value+data[2].value).slice(0,4) +'-'+ (data[0].value+data[1].value+data[2].value).slice(5,7) +'-'+ (data[0].value+data[1].value+data[2].value).slice(8,10);
          self.$emit('transferParamSelect',{name:self.model,value:self.modelValue});
        }
      });
    },
   
  }
</script>
