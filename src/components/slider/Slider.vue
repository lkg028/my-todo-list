<template>
  <div class="slider"><slot></slot></div>
</template>
<script>
import sliderItemGroup from './slider-item-group'
export default {
  data () {
    return {
      itemWidth: 0,
      title: '这里是父级'
    }
  },
  components: {
    sliderItemGroup
  },
  mounted () {
    this.initWidth()
    console.log(this.itemWidth)
  },
  methods: {
    // 初始化宽度：slider宽度，slider-item-group宽度，item宽度
    initWidth () {
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
