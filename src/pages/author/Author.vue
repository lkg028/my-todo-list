<template>
  <div class="container">
    <h3>我叫李开刚</h3>
    <ul>
      <li>代码：<a href="//github.com/lkg028/my-todo-list">点击查看</a></li>
      <li>博客：<a href="//lkg028.cn/">摩的大飚客</a></li>
      <li>邮箱：<span>lkg028@outlook.com</span></li>
      <li>GitHub: <a href="//github.com/lkg028">github.com/lkg028</a></li>
    </ul>
    <div class="wx">
      <img src="/static/images/wx.jpg" alt="">
      <span>扫一扫，联系我</span>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="stylus" scoped>
  .container
    padding 0 .2rem
    font-size .32rem
    h3
      font-size .38rem
      font-weight bold
      margin .3rem 0
    ul
      li
        margin .2rem 0
    .wx
      width 70%
      margin .8rem auto
      display flex
      flex-direction column
      align-items center
      padding .5rem
      box-sizing border-box
      background-color #ffffff
      border-radius .05rem
      img
        width 100%
        max-width 4rem
      span
        margin-top .3rem
</style>
