<template>
  <div class="container">
    <div class="head">
      <span>{{selectDate.year}}年{{selectDate.month}}月{{selectDate.day}}日 周{{selectDate.cnDay}}</span>
      <span>{{deltaDate}}</span>
    </div>
    <day-picker v-bind:assignDate="cloneSelectDate" @changeDate='update' :hasTags="hasTodo"></day-picker>
  </div>
</template>
<script>
import util from '@/util.js'
import { mapMutations, mapGetters, mapState } from 'vuex'
let {localStorage} = util
export default {
  data () {
    return {
      hasTodo: [] // 给日历打标数据
    }
  },
  components: {
    dayPicker: () => import('./dayPicker')
  },
  methods: {
    ...mapMutations(['update'])
  },
  computed: {
    ...mapState(['updateCalendarTagKey']),
    ...mapGetters(['cloneSelectDate']),
    // 显示时间，xxxx年xx月xx日周x
    selectDate () {
      let {year, month, day, week} = util.getYearMonthDayWeek(this.cloneSelectDate)
      let cnDay = ['日', '一', '二', '三', '四', '五', '六']
      return {year, month, day, cnDay: cnDay[week]}
    },
    // xx天前/后/今天
    deltaDate () {
      let {year, month, day} = util.getYearMonthDayWeek(new Date())
      let {year: selectYear, month: selectMonth, day: selectDay} = util.getYearMonthDayWeek(this.cloneSelectDate)
      let deltaDateNumber = this.cloneSelectDate.getTime() - (new Date()).getTime()
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
  watch: {
    updateCalendarTagKey () {
      // 通过监听store中的cloneSelectDate时间的变化，去更新日历打标数据
      // 构建对象数组，sortTime字段（打标在哪一天），tagColor字段（打标的颜色）【还未实现颜色】
      let tempHasTodo = []
      localStorage.each((val, key) => {
        if (val.type === 'todo' && (!val.hasDele)) tempHasTodo.push(JSON.stringify(val.sortTime))
      })
      tempHasTodo = [...new Set(tempHasTodo)]
      tempHasTodo.forEach((item, idx) => {
        tempHasTodo[idx] = JSON.parse(item)
      })
      // console.log(tempHasTodo)
      this.hasTodo = tempHasTodo
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
