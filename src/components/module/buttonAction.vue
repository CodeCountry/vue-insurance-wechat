<template>
	<div class="button_div">
    <button class="btn_base" @click="next_step" :action="action" :index="currentIndex">{{name}}</button>
	</div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props:['name','action','currentIndex'],
    methods:{
      next_step(){
        const self = this;
        self.$emit('formCommit',self.currentIndex+1);
      },
    }
  }
</script>
