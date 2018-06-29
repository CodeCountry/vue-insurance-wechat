<template>
    <div class="checkBox">
      <yd-checkbox v-model="checkbox" :required="required" color="#2191a2">
        <span v-html="label"></span>
      </yd-checkbox>
    </div>
</template>
<script>
  
  export default {
    data() {
      return {
        checkbox:this.checked,
      }
    },
    props:['label','required','checked'],
    mounted(){
    },
    watch:{
      'checkbox':function(){
        console.log(this.checkbox);
        this.$emit('transferData',{checkbox:this.checkbox});
      }
    }
  }
</script>
