<template>
  <div class="slider-item"><slot></slot></div>
</template>
<script>
export default {
  data () {
    return {
      itemWidth: 0
    }
  },
  mounted () {
    console.log('这里是slider-item：mounted')
  }
}
</script>
<style lang="stylus" scoped>
  .slider-item
    display inline-block
    font-size .32rem
</style>
