<template>
	<div>
    <yd-cell-item arrow>
      <span slot="left">{{label}}</span>
      <yd-input slot="right" :id="model" :required="required" readonly :show-required-icon="false" v-model="modelValue" max="20" :placeholder="placeholder"></yd-input>
    </yd-cell-item>
	</div>
</template>
<script>
    import MobileSelect from 'mobile-select';
    import Hub from '../../js/hub'    // 引入vue
    export default {
      data() {
        return {
          modelValue:'',
        }
      },
      props:['model','label','placeholder','required','options'],    // 父组件传值到子组件
      mounted() {
        const self = this;
        if(self.model==='vehicleCategory'){
          Hub.$emit('change',{category:true,value:self.modelValue}) //$emit触发监听方法
        }
        console.log(self.options);
        let mySelect = new MobileSelect({
          trigger: "#"+self.model,
          title: self.placeholder,
          wheels: [
            {data: self.options}
          ],
          callback:function(indexArr, data){
            self.modelValue = data[0].key;
            self.$emit('transferParamSelect',{name:self.model,value:self.modelValue});
            if(self.model==='vehicleCategory'){
              Hub.$emit('change',{category:true,value:self.modelValue}) //$emit触发监听方法
              sessionStorage.setItem('categoryValue',self.modelValue);
            }
          }
        });
      },
    }
</script>
