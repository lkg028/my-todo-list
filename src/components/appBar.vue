<template>
  <div class="container">
    <div class="btn">
      <router-link to="/" tag="span" class="iconfont back" v-show="showBack">
        &#xe612;
      </router-link>
      <span>{{barTitle}}</span>
      <span class="iconfont menu" @click="showMenu" v-show="!showBack">&#xe60f;</span>
    </div>
    <ul class="nav" v-if="menuKey">
      <router-link to="/search?q=all" tag="li">
        <span class="iconfont">&#xe623;</span>
        全部待办
      </router-link>
      <router-link to="/search?q=finished" tag="li">
        <span class="iconfont">&#xe60d;</span>
        已完成
      </router-link>
      <router-link to="/search?q=dele" tag="li">
        <span class="iconfont">&#xe652;</span>
        已删除
      </router-link>
      <router-link to="/author" tag="li">
        <span class="iconfont">&#xe603;</span>
        作者他
      </router-link>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuKey: false
    }
  },
  computed: {
    showBack () {
      return (this.$route.path !== '/')
    },
    barTitle () {
      let temp = ''
      let q = this.$route.query.q
      switch (q) {
        case 'all':
          temp = '全部待办'
          break
        case 'finished':
          temp = '已完成'
          break
        case 'dele':
          temp = '已删除'
          break
      }
      if (!temp) {
        if (this.$route.path === '/author') {
          temp = '作者他'
        } else {
          temp = '今天吃什么？'
        }
      }
      return temp
    }
  },
  methods: {
    showMenu (e) {
      this.menuKey = true
      e.stopPropagation()
    }
  },
  mounted () {
    document.body.addEventListener('click', () => {
      this.menuKey = false
    }, false)
  }
}
</script>
<style lang="stylus" scoped>
  .container
    position fixed
    top 0
    height 1rem
    width 100%
    background-color #419dff
    color #ffffff
    font-size .4rem
    font-weight bold
    z-index 999
    .btn
      position relative
      height 1rem
      line-height 1rem
      width 100%
      text-align center
      .back
        display inline-block
        position absolute
        left 0
        width 1rem
        height 1rem
        cursor pointer
      .menu
        display inline-block
        position absolute
        right 0
        width 1rem
        height 1rem
        cursor pointer
    .nav
      background-color #ffffff
      border-radius .08rem
      color #000
      font-weight normal
      font-size .36rem
      position absolute
      right .2rem
      top .2rem
      box-shadow: 1px 1px 10px .5px rgba(0, 0, 0, 0.2),-1px -1px 10px .5px rgba(0, 0, 0, 0.2)
      z-index 999
      li
        margin .2rem .2rem
        padding .2rem
        .iconfont
          margin-right .1rem
</style>
