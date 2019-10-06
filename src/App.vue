<template>
  <div id="app">
    <app-bar></app-bar>
    <router-view/>
    <!-- <slider class="container">
      <slider-item-group @now="changeData">
        <slider-item>
          <div>项目一</div>
          <div>项目一</div>
          <div>项目一</div>
          <div>项目一</div>
          <div>项目一</div>
        </slider-item>
        <slider-item>
          <div>项目二</div>
          <div>项目二</div>
          <div>项目二</div>
          <div>项目二</div>
          <div>项目二</div>
        </slider-item>
        <slider-item>
          <div>项目三</div>
          <div>项目三</div>
          <div>项目三</div>
          <div>项目三</div>
          <div>项目三</div>
        </slider-item>
      </slider-item-group>
    </slider> -->
  </div>
</template>

<script>
import appBar from '@/components/appBar'
import slider from '@/components/slider/Slider'
import sliderItemGroup from '@/components/slider/slider-item-group'
import sliderItem from '@/components/slider/slider-item'
export default {
  name: 'App',
  components: {
    appBar,
    slider,
    sliderItemGroup,
    sliderItem
  },
  methods: {
    changeData (now) {
      console.log(now)
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
    background-color #FFF
    margin .3rem .2rem
    font-size .32rem
</style>
