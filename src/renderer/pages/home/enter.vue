<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <img src="@etc/img/logo/logo-white.svg">
      </div>
      <h3 class="title"><span>SMPC</span> Wallet</h3>
      <p class="tip">欢迎使用SMPC Wallet 1.0<br>请创建一个钱包或者导入一个钱包</p>
      <div class="flex-c btn-box">
        <!-- <el-button type="primary" @click="toUrl('login')">{{$t('BTN').LOGIN}}</el-button>
        <el-button type="success" @click="toUrl('register')">{{$t('BTN').REGISTER}}</el-button> -->
        <router-link to="login" class="btn flex-c login">{{$t('BTN').LOGIN}}</router-link>
        <router-link to="register" class="btn flex-c register">{{$t('BTN').REGISTER}}</router-link>
        <div class="obliqueLine"></div>
      </div>
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
  .btn-box {
    width: size(240);margin: size(40) auto 0;position: relative;overflow:hidden;
    .btn {
      width: 50%;height: size(45);font-size: $text-md;font-weight: 600;border-radius:size(3);
    }
    .login {
      background: $color-primary;color: #fff;padding-right: size(15);
    }
    .register {
      border: size(1) solid $color-primary;color: $color-primary;padding-left: size(15);
    }
    .obliqueLine {
      width: size(20);height: size(240);position: absolute;background: #fff;transform: skew(-10deg);border-right: size(1) solid $color-primary;border-left: size(1) solid $color-primary;
    }
  }
}
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
    this.test = this.$$.eNode
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