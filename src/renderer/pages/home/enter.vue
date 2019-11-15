<template>
  <div class="bg flex-c">
    <div>
      <h3 class="color_ff center mb-20 font18">Fusion</h3>
      <el-button type="primary" @click="toUrl('login')">{{$t('BTN').LOGIN}}</el-button>
      <el-button type="success" @click="toUrl('register')">{{$t('BTN').REGISTER}}</el-button>
      <!-- <el-input v-model="test"></el-input> -->
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: '',
  data () {
    return {
      test: ''
    }
  },
  mounted () {
    // console.log(this.$$.web3)
    // this.test = this.$$.getEnode()
    // console.log(this.$$.getEnode())
    // console.log(this.$$.web3.isConnected())
    // let eNode = this.$$.web3.dcrm.getEnode()
    // console.log(JSON.parse(eNode))
    // let eNodeArr = [JSON.parse(eNode).Enode, "enode://d9d6003cd6ee3495e3ad3ff445c514c26919ee83158b9e99a3eb7848517a91352c2a942af0e8bdc6998d90a23ccad6c20ede555961e92f554e81b5de846528b9@127.0.0.1:12392", "enode://d9d6003cd6ee3495e3ad3ff445c514c26919ee83158b9e99a3eb7848517a91352c2a942af0e8bdc6998d90a23ccad6c20ede555961e92f554e81b5de846528b9@127.0.0.1:12393"]
    // let gData = this.$$.web3.dcrm.createSDKGroup('test', eNodeArr)
    // console.log(JSON.parse(gData))
    // let gArr = this.$$.web3.dcrm.getSDKGroup(JSON.parse(eNode).Enode)
    // console.log(JSON.parse(gArr))
  },
  methods: {
  }
}
</script>