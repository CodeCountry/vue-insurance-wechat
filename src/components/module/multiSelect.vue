<template>
	<div>
    <yd-cell-item>
      <span slot="left">{{label}}</span>
      <yd-checkbox-group slot="right" v-model="accessories" class="yd-checkbox-group">
        <yd-checkbox v-for="item in options" :key="item.key" :val="item.key">{{item.value}}</yd-checkbox>
      </yd-checkbox-group>
    </yd-cell-item>
	</div>
</template>
<script>
  export default {
    data() {
      return {
        accessories:[],    //辅助设备
        labelS:[],
        valueS:[],
        optionsM:[],
      }
    },
    props:['label','options'],
    mounted(){
      const self = this;
//      console.log(self.options);
      self.optionsM = self.options;
      console.log(self.optionsM);
      for(let i= 0;i<self.optionsM.length;i++){
        if(self.optionsM[i].checked){
          self.accessories.push(self.optionsM[i].key);
        }
        self.labelS.push(self.optionsM[i].key);
        self.valueS.push(false);
      }
    },
    watch:{       // 监听v-model的数据变化
      'accessories':function(val){
        const self = this;
        if(val.length<self.labelS.length){                // 如果选中的数组个数小于现有labelS的数组个数（即取消选中状态时）
          for(let j = 0;j<self.labelS.length;j++){
            if(val.indexOf(self.labelS[j])<0){            // 如果选中的数组中没有labelS中的某一条数据则被置为false
              self.valueS[j] = false;
            }else{
              self.valueS[j] = true;
            }
          }
        }else{
          for(let i = 0;i<val.length;i++){
            if(self.labelS.indexOf(val[i])>=0){           // 如果选中的数组等于labelS数组个数，且labelS中存在被选中的值，则置为true。
              self.valueS[self.labelS.indexOf(val[i])] = true;
            }
          }
        }
        this.$emit('transferData',{labelS:self.labelS,valueS:self.valueS,accessories:self.accessories})
      }
    },
    
  }
</script>
