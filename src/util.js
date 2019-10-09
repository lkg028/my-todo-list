// 引入浏览器本地存储包，用于存储todolist
let localStorage = require('store')
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

const getPanelDays = function (date) {
  date = new Date(date.getTime())
  let arr = []
  date.setDate(1)
  date.setDate(-getYearMonthDayWeek(date).week + 1)
  let starDate = date
  // console.log(starDate.getDate())
  for (let i = 0; i < 35; i++) {
    arr.push(new Date(starDate.getTime() + i * 1000 * 60 * 60 * 24))
    // console.log(arr[i].getDate())
  }
  return arr
}

export default {
  getPanelDays,
  getYearMonthDayWeek,
  localStorage
}
