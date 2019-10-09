<template>
  <div class="container">
    <div class="head">
      <span>{{year}}年{{month}}月{{day}}日 周{{cnDay}}</span>
      <span>{{deltaDate}}</span>
    </div>
    <day-picker v-bind:assignDate="cloneSelectDate" @changeDate='update'></day-picker>
  </div>
</template>
<script>
import util from '@/util.js'
import dayPicker from './dayPicker'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      today: new Date()
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
    ...mapGetters(['cnDay', 'cloneSelectDate']),
    deltaDate () {
      let {year, month, day} = util.getYearMonthDayWeek(this.today)
      let {year: selectYear, month: selectMonth, day: selectDay} = util.getYearMonthDayWeek(this.cloneSelectDate)
      let deltaDateNumber = this.cloneSelectDate.getTime() - this.today.getTime()
      let tempStr = ''
      if (year === selectYear && month === selectMonth && day === selectDay) {
        tempStr = '今天'
      } else if (deltaDateNumber > 0) {
        tempStr = `${Math.round(deltaDateNumber / 86400000)}天后`
      } else {
        tempStr = `${Math.round(-deltaDateNumber / 86400000)}天前`
      }
      return tempStr
    }
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
