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
    accountType (type) {
      console.log(type)
      this.$router.push({path: this.$route.path, query: {}})
      // this.refresh()
    }
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