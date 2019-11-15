<template>
  <div class="boxConntent1 container">
    <div class="n-list-box">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index" @click="toUrl('/gValid', item)">
          <p class="p1">{{item.Gname}}</p>
          <p class="p2">{{$$.timeChange({date: item.time, type: 'yyyy-mm-dd hh:mm:ss'})}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.n-list-box {
  width: 100%;min-height: 80%;padding: 30px 15px; background:#fff;margin:15px 0;
  .item {
    width: 100%;border-bottom: 1px solid #eee;padding:8px 0;font-size: 14px;color: #333;cursor: pointer;
    .p2{
      color:#999;
    }
  }
}
</style>

<script>
export default {
  name: '',
  data () {
    return {
      newsList: [
        {Gname: '组一', time: '1573788143592'},
        {Gname: '组2', time: '1573788143592'},
      ]
    }
  },
  mounted () {
    this.newsList = this.$$.getGroup()
    console.log(this.newsList)
  }
}
</script>