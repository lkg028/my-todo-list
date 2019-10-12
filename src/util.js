// 引入浏览器本地存储包，用于操作浏览器本地存储，存储todolist数据
let localStorage = require('store')

// 给定日期对象，返回年份（四位数字）、月份（1-12）、日期（1-31）、星期日-星期六（0-6）
const getYearMonthDayWeek = function (date) {
  date = new Date(date.getTime())
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let week = date.getDay()
  return {
    year,
    month,
    day,
    week
  }
}
/*
  ------------------------------------
  | 1  | 2  | 3  |  4 | 5  | 6  | 7  |
  | 8  | 9  | 10 | 11 | 12 | 13 | 14 |
  | 15 | 16 | 17 | 18 | 19 | 20 | 21 |
  | 22 | 23 | 24 | 25 | 26 | 27 | 28 |
  | 29 | 30 | 31 | 1  | 2  | 3  | 4  |
  ------------------------------------
*/
// 根据Date对象，生成日历面板的数组[1, 2, ...31, 1, 2]
const getPanelDays = function (date) {
  date = new Date(date.getTime())
  let arr = []
  date.setDate(1)
  date.setDate(-getYearMonthDayWeek(date).week + 1)
  let starDate = date
  for (let i = 0; i < 35; i++) {
    arr.push(new Date(starDate.getTime() + i * 1000 * 60 * 60 * 24))
  }
  return arr
}

export default {
  getPanelDays,
  getYearMonthDayWeek,
  localStorage
}
