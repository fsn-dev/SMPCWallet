<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <!-- <img :src="dayAndNight ? '~@etc/img/logo/logo-white.svg' : '~@etc/img/logo/logo-black.svg'"> -->
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title"><span>SMPC</span> Wallet</h3>
      <p class="tip">欢迎使用SMPC Wallet 1.0<br>请创建一个钱包或者导入一个钱包</p>
      <!-- <div class="flex-c btn-box">
        <router-link to="login" class="btn flex-c login">{{$t('BTN').LOGIN}}</router-link>
        <router-link to="register" class="btn flex-c register">{{$t('BTN').REGISTER}}</router-link>
        <div class="obliqueLine"></div>
      </div> -->
      <w-button :ok="$t('BTN').LOGIN" :cancel="$t('BTN').REGISTER" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-50"></w-button>
      <el-input v-model="test" class="mt-30"></el-input>
      <!-- <el-button type="primary" @click="test0">{{$t('BTN').LOGIN}}</el-button>
      <el-button type="success" @click="test1">{{$t('BTN').REGISTER}}</el-button> -->
      <!-- {{$$.getEnode().toString()}} -->
    </div>
  </div>
</template>

<style lang="scss">
.e-box {
  text-align: center;
  .logo {
    height: size(100);
    img {
      height: 100%;
    }
  }
  .title {
    font-size: $text-lg;font-weight: bold;color:$color-black;line-height: size(48);margin: size(40) 0 size(0);
    span {
      color:$color-primary;
    }
  }
  .tip {
    font-size: $text-normal;color:$color-gray;line-height: size(21);
  }
}
.night {
  .e-box {
    .title {
      color: #fff;
    }
  }
}
</style>

<script>
import wButton from '@/components/btn/index'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      test: ''
    }
  },
  components: {wButton},
  computed: {
    ...computedPub
  },
  mounted () {
    this.test = this.$$.eNode
  },
  methods: {
    // test0 () {
    //   this.$store.commit('setAddress', {info: '457487s8fg'})
    // },
    test1 (data) {
      // alert(this.address)
      console.log(data)
      alert(123)
    }
  }
}
</script>