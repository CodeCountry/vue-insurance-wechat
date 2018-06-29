<template>
  <div>
    <yd-cell-item>
      <span slot="left" v-if="label">{{label}}</span>
      <div slot="right" class="inputText">
        <input type="text" v-model="modelValue" :required="required" :show-required-icon="false" :placeholder="placeholder" v-on:blur="change">
        <span style="float: right;">
          <span class="yd-input-error" v-show="isRegex===-1"></span>
          <span class="yd-input-success" v-show="isRegex===1"></span>
        </span>
      </div>
    </yd-cell-item>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modelValue:'',
        isRegex:0,
      }
    },
    props:['model','label','placeholder','required','pattern'],
    methods:{
      change(){
        const self = this;
        if(!self.required) {
          self.isRegex = 0;
        }else if(self.modelValue !== '' && self.modelValue !== null && (self.pattern===null||self.pattern===''||self.modelValue.match(self.pattern))){
          self.isRegex = 1;
        }else{
          self.isRegex = -1;
        }
        self.$emit('transferParamSelect',{name:self.model,value:self.modelValue});
      }
    }
  }
</script>
