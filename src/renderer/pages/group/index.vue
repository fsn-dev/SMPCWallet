<template>
  <div class="i-g-box flex-bc">
    <div class="i-g-nav">
      <gList></gList>
    </div>
    <div class="i-g-dtil">
      <!-- <gDtil></gDtil> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
.i-g-box {
  width: 100%;height: 100%;position: relative;
  .i-g-nav {
    width: 30%;max-width: 300px;min-height: 200px;height: 100%;
  }
  .i-g-dtil {
    width: 100%;height: 100%;
  }
}
</style>

<script>
import gList from '@/pages/group/gList'
export default {
  name: '',
  data () {
    return {

    }
  },
  components: {gList},
  mounted () {
    
  }
}
</script>