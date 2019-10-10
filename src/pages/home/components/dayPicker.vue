<template>
  <div class="container">
      <div class="btn">
        <span @click="yearPanelCtr">年</span>
        <span @click="monthPanelCtr">月</span>
        <span class="today" v-show="notToday"
          @click="backToday"
        >
          今天
        </span>
      </div>
      <!-- 日期容器 -->
      <div class="day-cell pick-wrap" v-show="dayKey">
        <div class="day-cell-head">
          <span v-for="item in cnDay" v-bind:key="item">{{item}}</span>
        </div>
        <slider>
          <!-- 上个月 -->
          <slider-item-group @now="changeMonth">
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <div v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(prePanelDay[j + (i - 1) * 7 - 1], 'pre'),
                      'now-day': isNowDay(prePanelDay[j + (i - 1) * 7 - 1], 'pre')
                    }" class="day-cell"
                  >
                    <span class="has-todo" v-show="showTodoTag(prePanelDay[j + (i - 1) * 7 - 1])"></span>
                    <span>{{prePanelDay[j + (i - 1) * 7 - 1].getDate()}}</span>
                  </div>
                </div>
              </div>
            </slider-item>
            <!-- 本月 -->
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <div v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(nowPanelDay[j + (i - 1) * 7 - 1], 'now'),
                      'now-day': isNowDay(nowPanelDay[j + (i - 1) * 7 - 1], 'now'),
                      'assign-day': isAssignDay(nowPanelDay[j + (i - 1) * 7 - 1])
                    }"
                    class="day-cell"
                    v-on:click="updateDate(nowPanelDay[j + (i - 1) * 7 - 1])"
                  >
                    <span class="has-todo" v-show="showTodoTag(nowPanelDay[j + (i - 1) * 7 - 1])"></span>
                    <span>{{nowPanelDay[j + (i - 1) * 7 - 1].getDate()}}</span>
                  </div>
                </div>
              </div>
            </slider-item>
            <!-- 下个月 -->
            <slider-item>
              <div   class="day-cell-body">
                <div v-for="i in 5" v-bind:key="i" class="day-row">
                  <div v-for="j in 7" v-bind:key="`${i}+${j}`"
                    v-bind:class="{'now-month': isNowMonth(nextPanelDay[j + (i - 1) * 7 - 1], 'next'),
                                    'now-day': isNowDay(nextPanelDay[j + (i - 1) * 7 - 1], 'next')
                    }" class="day-cell"
                  >
                  {{nextPanelDay[j + (i - 1) * 7 - 1].getDate()}}
                  </div>
                </div>
              </div>
            </slider-item>
          </slider-item-group>
        </slider>
      </div>
      <!-- 年份容器 -->
      <div class="year-cell pick-wrap" v-if="yearKey">
        <slider>
          <slider-item-group @now="changeYear">
            <slider-item>
              <div class="year-cell-body">
                <span v-for="year in preTenYear" v-bind:key="year">{{year}}</span>
                <span></span><span></span>
              </div>
            </slider-item>
            <slider-item>
              <div class="year-cell-body">
                <span v-for="year in nowTenYear" v-bind:key="year"
                  v-on:click="gotoYear(year)"
                >
                  {{year}}
                </span>
                <span></span><span></span>
              </div>
            </slider-item>
            <slider-item>
              <div class="year-cell-body">
                <span v-for="year in nextTenYear" v-bind:key="year">
                  {{year}}
                </span>
                <span></span><span></span>
              </div>
            </slider-item>
          </slider-item-group>
        </slider>
      </div>
      <!-- 月份容器 -->
      <div class="month-cell-body pick-wrap" v-show="monthKey">
        <span class="month-cell" v-for="(month, idx) in cnMonth"
          v-bind:key='month' @click="toMonth(idx)"
        >
          {{month}}
        </span>
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
      cnMonth: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      today: new Date(),
      preMonth: null,
      nextMonth: null,
      yearKey: false,
      monthKey: false,
      dayKey: true
    }
  },
  components: {
    slider,
    sliderItemGroup,
    sliderItem
  },
  props: {
    assignDate: {
      type: Date,
      default: new Date()
    },
    hasTodo: {
      type: Array,
      default () { return [] }
    }
  },
  computed: {
    nowPanelDay () {
      return util.getPanelDays(this.assignDate)
    },
    prePanelDay () {
      return util.getPanelDays(this.preMonth)
    },
    nextPanelDay () {
      return util.getPanelDays(this.nextMonth)
    },
    notToday () {
      let {year, month, day} = util.getYearMonthDayWeek(this.today)
      let {year: assignYear, month: assignMonth, day: assignDay} = util.getYearMonthDayWeek(this.assignDate)
      return !(year === assignYear && month === assignMonth && day === assignDay)
    },
    preTenYear () {
      let {year} = util.getYearMonthDayWeek(this.assignDate)
      let years = []
      for (let i = 0; i < 10; i++) {
        years.push(year + i - 10)
        console.log(years[i])
      }
      return years
    },
    nowTenYear () {
      let {year} = util.getYearMonthDayWeek(this.assignDate)
      let years = []
      for (let i = 0; i < 10; i++) {
        years.push(year + i)
        console.log(years[i])
      }
      return years
    },
    nextTenYear () {
      let {year} = util.getYearMonthDayWeek(this.assignDate)
      let years = []
      for (let i = 0; i < 10; i++) {
        years.push(year + i + 10)
        console.log(years[i])
      }
      return years
    }
  },
  watch: {
    assignDate (newData) {
      let dateNumber = newData.getTime()
      let {month} = util.getYearMonthDayWeek(newData)
      // 设置上个月
      this.preMonth = new Date(dateNumber)
      this.preMonth.setMonth(month - 2)
      //  设置下个月
      this.nextMonth = new Date(dateNumber)
      this.nextMonth.setMonth(month)
    }
  },
  methods: {
    showTodoTag (cellDate) {
      let {year, month, day} = util.getYearMonthDayWeek(cellDate)
      let showKey = false
      for (let item of this.hasTodo) {
        if (item.year === year && item.month === month && item.day === day) {
          showKey = true
          break
        }
      }
      return showKey
    },
    isNowMonth (cellDate, whichMonth) {
      switch (whichMonth) {
        case 'pre':
          whichMonth = this.preMonth
          break
        case 'next':
          whichMonth = this.nextMonth
          break
        default:
          whichMonth = this.assignDate
      }
      console.log()
      let {year, month} = util.getYearMonthDayWeek(whichMonth)
      let {year: cellYear, month: cellMonth} = util.getYearMonthDayWeek(cellDate)
      return year === cellYear && month === cellMonth
    },
    isNowDay (cellDate, whichMonth) {
      let {year, month, day} = util.getYearMonthDayWeek(this.today)
      let {year: cellYear, month: cellMonth, day: cellDay} = util.getYearMonthDayWeek(cellDate)
      return year === cellYear && month === cellMonth && day === cellDay
    },
    isAssignDay (cellDate) {
      let {year, month, day} = util.getYearMonthDayWeek(this.assignDate)
      let {year: cellYear, month: cellMonth, day: cellDay} = util.getYearMonthDayWeek(cellDate)
      return year === cellYear && month === cellMonth && day === cellDay
    },
    updateDate (cellDate) {
      this.$emit('changeDate', cellDate)
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
    },
    toMonth (newMonth) {
      let newMonthDate = new Date(this.assignDate.getTime())
      newMonthDate.setMonth(newMonth)
      this.$emit('changeDate', newMonthDate)
      this.dayPanelCtr()
    },
    backToday () {
      this.$emit('changeDate', new Date())
      if (!this.dayKey) this.dayPanelCtr()
    },
    yearPanelCtr (e) {
      if (this.yearKey) {
        this.yearKey = false
        this.monthKey = false
        this.dayKey = true
      } else {
        this.yearKey = true
        this.monthKey = false
        this.dayKey = false
      }
    },
    monthPanelCtr () {
      if (this.monthKey) {
        this.yearKey = false
        this.monthKey = false
        this.dayKey = true
      } else {
        this.yearKey = false
        this.monthKey = true
        this.dayKey = false
      }
    },
    dayPanelCtr () {
      this.yearKey = false
      this.monthKey = false
      this.dayKey = true
    },
    changeYear (direction) {
      // left减去10年，right加上10年
      let date = new Date(this.assignDate.getTime())
      let {year} = util.getYearMonthDayWeek(date)
      // left减少月份，right增加月份
      switch (direction) {
        case 'left':
          date.setFullYear(year - 10)
          this.$emit('changeDate', date)
          break
        case 'right':
          date.setFullYear(year + 10)
          this.$emit('changeDate', date)
      }
    },
    gotoYear (nowYear) {
      let date = new Date(this.assignDate.getTime())
      date.setFullYear(nowYear)
      this.$emit('changeDate', date)
      this.monthPanelCtr()
    }
  },
  created () {
    let dateNumber = this.assignDate.getTime()
    let {month} = util.getYearMonthDayWeek(this.assignDate)
    // 设置上个月
    this.preMonth = new Date(dateNumber)
    this.preMonth.setMonth(month - 2)
    //  设置下个月
    this.nextMonth = new Date(dateNumber)
    this.nextMonth.setMonth(month)
  }
}
</script>
<style lang="stylus" scoped>
  .container
    background-color #FFF
    border 1px solid #419cff
    border-radius .08rem
    margin .3rem .2rem 0
    font-size .32rem
    .btn
      position relative
      color #419dff
      font-size .4rem
      text-align center
      height .8rem
      line-height .8rem
      font-weight bold
      border-bottom 1px solid #419cff
      span
        margin 0 .2rem
      .today
        display inline-block
        position absolute
        top 0
        right 0
        height .8rem
        line-height .8rem
    .pick-wrap
      width 90%
      margin .2rem auto
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
        min-height 4rem
        border-collapse separate
        border-spacing: 2px
        .day-row
          display table-row
          width 100%
          .day-cell
            position relative
            display table-cell
            box-sizing border-box
            text-align center
            vertical-align middle
            border 1px solid transparent
            color gray
            font-size .36rem
          .has-todo
            position absolute
            display inline-block
            width .1rem
            height .1rem
            top 3%
            left 50%
            margin-left -0.05rem
            background-color #419dff
            border-radius 0.05rem
          .now-month
            font-weight bold
            color #000
          .now-day
            color #ffffff
            background-color #419cff
            border-radius .1rem
          .assign-day
            border-color #419cff
            border-radius .1rem
    .month-cell-body
      display flex
      flex-wrap wrap
      min-height 4.52rem
      span
        display inline-flex
        justify-content center
        align-items center
        width 25%
        font-size .36rem
        font-weight bold
        color #000
    .year-cell-body
      display flex
      flex-wrap wrap
      min-height 4.52rem
      span
        display inline-flex
        justify-content center
        align-items center
        width 25%
        font-size .36rem
        font-weight bold
        color #000
</style>
