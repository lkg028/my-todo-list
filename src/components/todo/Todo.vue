<template>
  <div class="container">
    <template v-if="thatDayTodo.length">
      <!-- 根据所选的日期，渲染出当前日期所有代办事项以及已经完成的事项 -->
      <h3>待处理</h3>
      <template v-if="notFinished.length">
        <todo-item v-for="item in notFinished" :todoItem="item.data" @desc-click="edit(item.key)"
        @updateItem="updateItem(item.key, $event)" v-bind:key="item.key"></todo-item>
      </template>
      <template v-if="!notFinished.length">
        <p style="text-align:center">nice!&nbsp;&nbsp;事情都搞定了</p>
      </template>
      <h3>已完成</h3>
      <template v-if="hasFinished.length">
        <todo-item v-for="item in hasFinished" :todoItem="item.data"
        @updateItem="updateItem(item.key, $event)" v-bind:key="item.key"></todo-item>
      </template>
      <template v-if="!hasFinished.length">
        <p style="text-align:center">加油，小伙子!&nbsp;&nbsp;放开干吧</p>
      </template>
    </template>
    <!-- 条件显示：事项为零显示的内容 -->
    <template v-if="!thatDayTodo.length">
      <p>哈哈，这一天啥事都没有。</p>
    </template>
    <!-- 默认显示：输入区域 -->
    <add v-bind:add-or-edit="addOrEdit" v-bind:edit-key="editKey" @submit="closeEdit" v-show="showEditKey"></add>
    <!-- 默认显示：添加按钮 -->
    <span class="add-todo-btn iconfont" v-show="!showEditKey" @click="addBtnClick">&#xe692;</span>
  </div>
</template>
<script>
import util from '@/util.js'
import { mapMutations, mapGetters } from 'vuex'
import axios from 'axios'
let {localStorage} = util
export default {
  components: {
    add: () => import('./add'),
    todoItem: () => import('./todo-item')
  },
  props: {
    days: {
      type: Array
    }
  },
  data () {
    return {
      // 用来存储当前选择日期的Todo
      thatDayTodo: [],
      // 添加编辑板块
      showEditKey: false,
      addOrEdit: '',
      editKey: 0
    }
  },
  computed: {
    ...mapGetters(['cloneSelectDate', 'selectSortTime']),
    hasFinished () {
      let tempArr = []
      this.thatDayTodo.forEach((item) => {
        if (item.data.hasFinished) tempArr.push(item)
      })
      return tempArr
    },
    notFinished () {
      let tempArr = []
      this.thatDayTodo.forEach((item) => {
        if (!item.data.hasFinished) tempArr.push(item)
      })
      return tempArr
    }
  },
  watch: {
    // 选择的时间变动，从新获取数据
    cloneSelectDate () {
      this.initThatDayTodo()
      this.showEditKey = false
    },
    thatDayTodo () {
      // 当todo有数据更新的时候，使用时间戳通知日历组件更新打标
      this.updateCalendarTag()
    }
  },
  created () {
    let secondLoad = localStorage.get('secondLoad')
    if (!secondLoad) {
      // 浏览器第一次加载页面，初始数据
      axios.get('/static/mock/init-todo.json')
        .then((res) => {
          let {year, month, day} = util.getYearMonthDayWeek(new Date())
          res.data.forEach((item, idx) => {
            if (!item.sortTime) item.sortTime = {year, month, day}
            localStorage.set((new Date()).getTime() + idx * 100, item)
          })
          // 初始化数据，把数据从localStorage中读取出来，存储到data中
          this.initThatDayTodo()
          localStorage.set('secondLoad', true)
        })
    } else {
      this.initThatDayTodo()
    }
  },
  methods: {
    // store commit相关
    ...mapMutations(['updateCalendarTag']),
    initThatDayTodo () {
      let tempDayTodo = []
      let {year, month, day} = this.selectSortTime
      // 遍历本地存储，获得当天的未删除的条目
      localStorage.each((val, key) => {
        if (val.type === 'todo' && (!val.hasDele) && val.sortTime.year === year &&
          val.sortTime.month === month && val.sortTime.day === day) {
          tempDayTodo.push({key: +key, data: val})
        }
      })
      // 对遍历的结果，根据时间戳的先后进行排序
      tempDayTodo.sort((a, b) => {
        return a.key - b.key
      })
      this.thatDayTodo = tempDayTodo
    },
    // 点击item 文本区域触发编辑框
    edit (key) {
      console.log('点击了todoitem')
      // 编辑模式
      this.showEditKey = true
      this.addOrEdit = 'edit'
      this.editKey = key
    },
    // 添加按钮点击事件
    addBtnClick () {
      // 添加模式
      this.showEditKey = true
      this.addOrEdit = 'add'
      this.editKey = 0
    },
    // 接收数据，关闭编辑框
    closeEdit (newData) {
      // 提交数据，关闭编辑板块
      if (newData) {
        if (this.editKey) {
          // 编辑模式
          localStorage.set(this.editKey, newData)
        } else {
          // 添加数据模式
          localStorage.set((new Date()).getTime(), newData)
        }
        this.initThatDayTodo()
      }
      this.showEditKey = false
      this.editKey = 0
      this.addOrEdit = ''
    },
    updateItem (key, newData) {
      // 如果有发来Key值，那就是修改某个数据，如果没有，那就是添加数据
      let newKey = null
      if (!key) {
        // 新数据，存入本地存储，存入this.thatDayTodo
        newKey = new Date()
        this.thatDayTodo.push({key: newKey, data: newData})
      } else {
        newKey = key
        for (let [idx, item] of this.thatDayTodo.entries()) {
          if (item.key === key) {
            if (newData.hasDele) this.thatDayTodo.splice(idx, 1)
            else this.thatDayTodo.splice(idx, 1, {key, data: newData})
          }
        }
      }
      localStorage.set(newKey, newData)
    }
  }// methods结束
}
</script>
<style lang="stylus" scoped>
  .container
    margin .3rem .2rem
    font-size .32rem
    h3
      margin .1rem 0
      color #666
    .todo-list
      overflow hidden
    .finished
      li
        color #ccc
    .input-wrap
      position fixed
      bottom 0
      min-height .85rem
    .add-todo-btn
      display inline-block
      width 1rem
      height 1rem
      line-height 1rem
      text-align center
      border-radius .5rem
      color #fff
      background-color #419dff
      position fixed
      bottom .3rem
      right .3rem
      font-size .4rem
</style>
