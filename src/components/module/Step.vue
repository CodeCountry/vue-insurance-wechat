<template>
	<div class="stepNum">
    <span class="currentStep">{{currentStep}}</span>
    <img src="/static/img/pic_title.png" alt="">
    <span class="steps">{{steps}}</span>
	</div>
</template>
<script>
  export default {
    data() {
        return {}
    },
    props:['steps','currentStep']
  }
</script>
