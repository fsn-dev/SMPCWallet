<template>
  <div class="h-bg bg">
    <router-view></router-view>
  </div>
</template>

<style>
.h-bg {
  background: #fff;
  /* background: -webkit-gradient(linear,left top,left bottom,from(#2677fe),to(#7e63ff)); background: linear-gradient(180deg,#2677fe,#7e63ff); background: -moz-linear-gradient(to bottom,#2677fe,#7e63ff); */
  /* background: url('~@/assets/img/bg1.jpg') no-repeat center rgba(0, 0, 0, .5);background-size: cover; */
}
</style>

<script>
export default {
  name: '',
  data () {
    return {

    }
  },
  // components: {enterPage},
  mounted () {
    
  }
}
</script>