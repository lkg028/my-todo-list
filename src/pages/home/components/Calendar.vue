<template>
  <div class="container">
    <div class="head">
      <span>{{year}}年{{month}}月{{day}}日 周{{cnDay}}</span>
      <span>差值</span>
    </div>
    <day-picker :dayKey="true" v-bind:assignDate="cloneSelectDate" @changeDate='update'></day-picker>
  </div>
</template>
<script>
// import util from '@/util.js'
import dayPicker from './dayPicker'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  components: {
    dayPicker
  },
  methods: {
    ...mapMutations(['update'])
  },
  computed: {
    ...mapState(['selectDate', 'year', 'month', 'day', 'week']),
    ...mapGetters(['cnDay', 'cloneSelectDate'])
  },
  mounted () {
    this.update(this.cloneSelectDate)
  }
}
</script>
<style lang="stylus" scoped>
  .container
    overflow hidden
    .head
      display flex
      justify-content space-between
      padding 0 .2rem
      margin-top .4rem
      color #419dff
      font-size .4rem
      font-weight bold
</style>
