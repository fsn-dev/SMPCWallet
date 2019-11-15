<template>
  <div class="h-bg bg">
    <enterPage></enterPage>
  </div>
</template>

<style lang="scss">
.h-bg {
  background: -webkit-gradient(linear,left top,left bottom,from(#2677fe),to(#7e63ff)); background: linear-gradient(180deg,#2677fe,#7e63ff); background: -moz-linear-gradient(to bottom,#2677fe,#7e63ff);
}
</style>

<script>
import enterPage from '@/pages/home/enter'
export default {
  name: '',
  data () {
    return {

    }
  },
  components: {enterPage},
  mounted () {
    
  }
}
</script>