<template>
  <div class="account-box flex-bc">
    <div class="account-nav">
      <accountList @changeAccount="refresh"></accountList>
    </div>
    <div class="account-dtil">
      <!-- <gDtil></gDtil> -->
      <!-- <keep-alive> -->
        <router-view v-if="isRefresh"></router-view>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<style lang="scss">
.account-box {
  width: 100%;height: 100%;position: relative;padding-left: 300px;
  .account-nav {
    width: 300px;min-height: 200px;height: 100%;position: absolute;top:0;left: 0;bottom: 0;
  }
  .account-dtil {
    width: 100%;height: 100%;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import accountList from './list.vue'
export default {
  name: '',
  data () {
    return {
      isRefresh: false
    }
  },
  watch: {
    // '$route' (cur) {
    //   console.log(cur)
    //   this.refresh()
    // },
    // accountType (type) {
    //   // console.log(type)
    //   this.$router.push({path: this.$route.path, query: {}})
    //   // this.refresh()
    // }
  },
  components: {accountList},
  computed: {
    ...computedPub,
  },
  mounted () {
    
  },
  methods: {
    refresh () {
      this.isRefresh = false
      this.$nextTick(() => {
        this.isRefresh = true
      })
    }
  }
}
</script>