<template>
  <div class="slider"><slot></slot></div>
</template>
<script>
export default {
  data () {
    return {
      itemWidth: 0,
      title: '这里是父级'
    }
  },
  mounted () {
    console.log('这里是slider：mounted')
    this.initWidth()
    // 当窗口尺寸调整的时候，重新调整slider组件
    window.addEventListener('resize', () => {
      this.initWidth()
    }, false)
  },
  methods: {
    // 初始化宽度：slider宽度，slider-item-group宽度，item宽度
    initWidth () {
      console.log('这里是slider的初始化宽度函数')
      this.itemWidth = parseFloat(window.getComputedStyle(this.$el).width)
      this.$children[0].initWidth(this.itemWidth)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .slider
    box-sizing border-box
    overflow hidden
</style>
