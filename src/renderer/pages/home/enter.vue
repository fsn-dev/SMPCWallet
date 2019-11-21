<template>
  <div class="bg flex-c">
    <div>
      <h3 class="color_ff center mb-20 font18">Fusion</h3>
      <el-button type="primary" @click="toUrl('login')">{{$t('BTN').LOGIN}}</el-button>
      <el-button type="success" @click="toUrl('register')">{{$t('BTN').REGISTER}}</el-button>
      <el-input v-model="test"></el-input>
      <!-- <el-button type="primary" @click="test0">{{$t('BTN').LOGIN}}</el-button>
      <el-button type="success" @click="test1">{{$t('BTN').REGISTER}}</el-button> -->
      <!-- {{$$.getEnode().toString()}} -->
    </div>
  </div>
</template>

<style>

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      test: ''
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    this.test = this.$$.getEnode()
  },
  methods: {
    // test0 () {
    //   this.$store.commit('setAddress', {info: '457487s8fg'})
    // },
    // test1 () {
    //   alert(this.address)
    // }
  }
}
</script>