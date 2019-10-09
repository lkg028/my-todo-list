import Vue from 'vue'
import Vuex from 'vuex'
import util from '@/util.js'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    selectDate: new Date(),
    year: 0,
    month: 0,
    day: 0,
    week: 0
  },
  getters: {
    cnDay (state) {
      return ['天', '一', '二', '三', '四', '五', '六'][state.week]
    },
    cloneSelectDate (state) {
      return new Date(state.selectDate.getTime())
    }
  },
  mutations: {
    update (state, payload) {
      let {year, month, day, week} = util.getYearMonthDayWeek(payload)
      state.selectDate = payload
      state.year = year
      state.month = month
      state.day = day
      state.week = week
    }
  }
})
