<template>
  <div class="container">
      <div class="btn">
        <span>年</span>
        <span>月</span>
      </div>
      <!-- 日期容器 -->
      <div class="day-cell pick-wrap" v-if="dayKey">
        <div class="day-cell-head">
          <span v-for="item in cnDay" v-bind:key="item">{{item}}</span>
        </div>
        <slider>
          <slider-item-group @now="changeMonth">
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <span v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(prePanelDay[j + (i - 1) * 7 - 1]),
                      'now-day': isNowDay(prePanelDay[j + (i - 1) * 7 - 1])
                    }"
                  >
                  {{prePanelDay[j + (i - 1) * 7 - 1].getDate()}}</span>
                </div>
              </div>
            </slider-item>
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <span v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(nowPanelDay[j + (i - 1) * 7 - 1]),
                      'now-day': isNowDay(nowPanelDay[j + (i - 1) * 7 - 1])
                    }"
                  >
                  {{nowPanelDay[j + (i - 1) * 7 - 1].getDate()}}</span>
                </div>
              </div>
            </slider-item>
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <span v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(nowPanelDay[j + (i - 1) * 7 - 1]),
                      'now-day': isNowDay(nextPanelDay[j + (i - 1) * 7 - 1])
                    }"
                  >
                  {{nextPanelDay[j + (i - 1) * 7 - 1].getDate()}}</span>
                </div>
              </div>
            </slider-item>
          </slider-item-group>
        </slider>
      </div>
      <!-- 月份容器 -->
      <div class="year-cell pick-wrap" v-if="yearKey">
        这里放年选择器
      </div>
      <!-- 年份容器 -->
      <div class="month-cell pick-wrap" v-if="monthKey">
        这里放月份选择器
      </div>
  </div>
</template>
<script>
import util from '@/util.js'
// 引入slider组件，使可以滑动选择日期
import slider from '@/components/slider/Slider'
import sliderItemGroup from '@/components/slider/slider-item-group'
import sliderItem from '@/components/slider/slider-item'
export default {
  data () {
    return {
      cnDay: ['日', '一', '二', '三', '四', '五', '六'],
      today: new Date()
    }
  },
  components: {
    slider,
    sliderItemGroup,
    sliderItem
  },
  props: {
    yearKey: Boolean,
    monthKey: Boolean,
    dayKey: Boolean,
    assignDate: {
      type: Date,
      default: new Date()
    }
  },
  computed: {
    nowPanelDay () {
      let date = new Date(this.assignDate.getTime())
      let {month} = util.getYearMonthDayWeek(date)
      console.log('这个月' + date)
      return util.getPanelDays(date)
    },
    prePanelDay () {
      let date = new Date(this.assignDate.getTime())
      let {month} = util.getYearMonthDayWeek(date)
      date.setMonth(month - 2)
      console.log('上个月' + date)
      // let {month} = util.getYearMonthDayWeek(this.selectDate)
      return util.getPanelDays(date)
    },
    nextPanelDay () {
      let date = new Date(this.assignDate.getTime())
      let {month} = util.getYearMonthDayWeek(date)
      date.setMonth(month)
      console.log('下个月' + date)
      // let {year, month} = util.getYearMonthDayWeek(this.selectDate)
      return util.getPanelDays(date)
    }
  },
  methods: {
    isNowMonth (cellDate, whichMonth) {
      let {year, month} = util.getYearMonthDayWeek(this.assignDate)
      let {year: cellYear, month: cellMonth} = util.getYearMonthDayWeek(cellDate)
      return year === cellYear && month === cellMonth
    },
    isNowDay (cellDate, whichMonth) {
      let {year, month, day} = util.getYearMonthDayWeek(this.today)
      let {year: cellYear, month: cellMonth, day: cellDay} = util.getYearMonthDayWeek(cellDate)
      return year === cellYear && month === cellMonth && day === cellDay
    },
    updateDate () {
      // this.$emit('updateDate', this.selectDate)
    },
    changeMonth (direction) {
      let date = new Date(this.assignDate.getTime())
      let {month} = util.getYearMonthDayWeek(date)
      // left减少月份，right增加月份
      switch (direction) {
        case 'left':
          date.setMonth(month - 2)
          this.$emit('changeDate', date)
          break
        case 'right':
          date.setMonth(month)
          this.$emit('changeDate', date)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container
    background-color #FFF
    border 1px solid #419cff
    border-radius .08rem
    margin .3rem .2rem
    font-size .32rem
    .btn
      color #9fcfff
      font-size .4rem
      text-align center
      height .8rem
      line-height .8rem
      font-weight bold
      border-bottom 1px solid #419cff
      span
        margin 0 .2rem
    .pick-wrap
      width 90%
      margin .25rem auto
      .day-cell-head
        display flex
        justify-content space-between
        margin-bottom .2rem
        color gray
        span
          flex 1 1 auto
          text-align center
          user-select none
      .day-cell-body
        display table
        width 100%
        margin-top .2rem
        margin-bottom .2rem
        min-height 4.5rem
        .day-row
          display table-row
          width 100%
          span
            display table-cell
            box-sizing border-box
            text-align center
            vertical-align middle
            border 1px solid transparent
            color gray
            font-size .36rem
          span:hover
            border-color #419cff
            border-radius .1rem
          .now-month
            font-weight bold
            color #000
          .now-day
            color #ffffff
            background-color #419cff
            border-radius .1rem
</style>
