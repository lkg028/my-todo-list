// 存放app级别的数据，用于Calendar、todo组件数据共享
import Vue from 'vue'
import Vuex from 'vuex'
import util from '@/util'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    selectDate: new Date(),
    updateCalendarTagKey: 0 // 是时间戳，用于todo组件变化通知calendar告知内部组件dayPicker修改打标信息
  },
  getters: {
    // 使用克隆的对象，避免对象被直接更改
    cloneSelectDate (state) {
      return new Date(state.selectDate.getTime())
    },
    selectSortTime (state) {
      let {year, month, day} = util.getYearMonthDayWeek(state.selectDate)
      return {year, month, day}
    }
  },
  mutations: {
    update (state, payload) {
      state.selectDate = payload
    },
    updateCalendarTag (state) {
      console.log('这里是store.js,收到通知修改日历打标数据')
      state.updateCalendarTagKey = (new Date()).getTime()
    }
  }
})
