<template>
  <div class="flex-c">
    <el-tooltip :content="networkModeVal" placement="top">
      <el-switch v-model="networkModeVal" :active-value="$t('state').on" :inactive-value="$t('state').off" @change="changeNetworkMode">
      </el-switch>
    </el-tooltip>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'changeNetworkMode',
  data () {
    return {
      networkModeVal: ''
    }
  },
  computed: {
    ...computedPub
  },
  watch: {
    networkMode () {
      // console.log(this.networkMode)
      this.networkModeVal = this.networkMode ? this.$t('state').on : this.$t('state').off
    },
    language () {
      this.networkModeVal = this.networkMode ? this.$t('state').on : this.$t('state').off
    }
  },
  mounted () {
    this.networkModeVal = this.networkMode ? this.$t('state').on : this.$t('state').off
    // console.log(this.networkMode)
    // console.log(this.networkModeVal)
  },
  methods: {
    changeNetworkMode (val) {
      // console.log(val)
      if (val === this.$t('state').on) {
        this.$store.commit('setNetworkMode', {info: 1})
      } else {
        this.$store.commit('setNetworkMode', {info: 0})
      }
      this.$emit('changeNetworkMode')
    }
  }
}
</script>
