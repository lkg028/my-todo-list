<template>
  <div class="container">
    <div class="head">
      <span>{{year}}年{{month}}月{{day}}日 周{{cnDay}}</span>
      <span>{{deltaDate}}</span>
    </div>
    <day-picker v-bind:assignDate="cloneSelectDate" @changeDate='update' :hasTodo="hasTodo"></day-picker>
  </div>
</template>
<script>
import util from '@/util.js'
import dayPicker from './dayPicker'
import { mapState, mapMutations, mapGetters } from 'vuex'
let {localStorage} = util
export default {
  data () {
    return {
      today: new Date(),
      hasTodo: []
    }
  },
  components: {
    dayPicker
  },
  methods: {
    ...mapMutations(['update'])
  },
  computed: {
    ...mapState(['selectDate', 'year', 'month', 'day', 'week', 'updateTagKey']),
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
  watch: {
    updateTagKey () {
      // 通过监听store中的'updateTagKey'时间戳的变化，去更新日历打标数据
      // 构建对象数组，sortTime字段（打标在哪一天），tagColor字段（打标的颜色）【还未实现颜色】
      let tempHasTodo = []
      localStorage.each((val, key) => {
        if (val.type === 'todo' && (!val.hasDele)) tempHasTodo.push(JSON.stringify(val.sortTime))
      })
      tempHasTodo = [...new Set(tempHasTodo)]
      tempHasTodo.forEach((item, idx) => {
        tempHasTodo[idx] = JSON.parse(item)
      })
      console.log(tempHasTodo)
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
