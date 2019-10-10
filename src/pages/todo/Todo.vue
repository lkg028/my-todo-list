<template>
  <div class="container">
    <template v-if="thatDayTodo.length">
      <!-- 根据所选的日期，渲染出当前日期所有代办事项以及已经完成的事项 -->
      <h3>待处理</h3>
      <template v-if="notFinished.length">
        <ul class="todo-list">
          <li v-for="(item, idx) in notFinished" v-bind:key="item.key" v-swipeout>
            <div class="todo-tag iconfont" @click="toFinished(idx)">&#xe71e;</div>
            <div @click="edit(item.key)"  class="desc">
              <span>{{item.data.desc}}</span>
              <span class="important-desc">{{item.data.isImportant ? '重要任务' : '一般任务'}}</span>
            </div>
            <div class="important-tag iconfont" @click="importantChange(idx)">
              {{item.data.isImportant ? '&#xe605;' : '&#xe600;'}}
            </div>
            <div class="dele-btn iconfont" @click="removeItem(item.key)">&#xe652;</div>
          </li>
        </ul>
      </template>
      <template v-if="!notFinished.length">
        <p style="text-align:center">nice!&nbsp;&nbsp;事情都搞定了</p>
      </template>
      <h3>已完成</h3>
      <template v-if="hasFinished.length">
        <ul class="todo-list finished">
          <li v-for="(item, idx) in hasFinished" v-bind:key="item.key" v-swipeout>
            <div class="todo-tag iconfont" @click="toUnfinished(idx)">&#xe60d;</div>
            <div class="desc">
              {{item.data.desc}}<br>{{item.data.isImportant ? '重要任务' : '一般任务'}}
            </div>
            <div class="important-tag iconfont">
              {{item.data.isImportant ? '&#xe605;' : '&#xe600;'}}
            </div>
            <div class="dele-btn iconfont" @click="removeItem(item.key)">&#xe652;</div>
          </li>
        </ul>
      </template>
      <template v-if="!hasFinished.length">
        <p style="text-align:center">加油，小伙子!&nbsp;&nbsp;放开干吧</p>
      </template>
      <!-- 输入区域 -->
      <add v-bind:add-or-edit="addOrEdit" v-bind:edit-key="editKey" @submit="closeEdit" v-show="showEditKey"></add>
    </template>
    <template v-if="!thatDayTodo.length">
      <p>哈哈，这一天啥事都没有。</p>
    </template>
    <!-- 添加按钮 -->
    <span class="add-todo-btn iconfont" v-show="!showEditKey" @click="addBtnClick">&#xe692;</span>
  </div>
</template>
<script>
import util from '@/util.js'
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
let {localStorage} = util
export default {
  components: {
    add: () => import('./add')
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
  directives: {
    swipeout: {
      bind (el) {
        let deltaX = 0
        let startX = 0
        let dragKey = false
        let time = null
        let dragStart = (e) => {
          console.log('dragStrat')
          dragKey = true
        }
        let dragMove = (e) => {
          console.log('dragMove')
          let screenX = e.changedTouches[0].screenX
          if (dragKey) {
            if (!startX) startX = screenX
            deltaX = screenX - startX
          }
          // e.preventDefault()
        }
        let dragEnd = (e) => {
          if (deltaX < -30) el.style.transform = 'translate3d(-1rem,0,0)'
          if (!time) {
            time = setTimeout(() => {
              el.style.transform = 'translate3d(0,0,0)'
              time = null
            }, 1000)
          } else {
            clearTimeout(time)
            time = setTimeout(() => {
              el.style.transform = 'translate3d(0,0,0)'
              time = null
            }, 1000)
          }
          // 初始化原始数据
          deltaX = 0
          startX = 0
          dragKey = false
        }
        el.addEventListener('touchstart', dragStart, false)
        el.addEventListener('touchmove', dragMove, false)
        el.addEventListener('touchend', dragEnd, false)
      }
    }
  },
  computed: {
    ...mapState(['selectDate', 'year', 'month', 'day', 'week']),
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
    selectDate () {
      this.initThatDayTodo()
    },
    thatDayTodo () {
      // 当todo有数据更新的时候，使用时间戳通知日历组件更新打标
      this.updateTag()
    }
  },
  created () {
    let secondLoad = localStorage.get('secondLoad')
    if (!secondLoad) {
      // 浏览器第一次加载页面，初始数据

      axios.get('/demo/todo/static/mock/init-todo.json')
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
    ...mapMutations(['updateTag']),
    initThatDayTodo () {
      let tempDayTodo = []
      // 遍历本地存储，获得当天的未删除的条目
      localStorage.each((val, key) => {
        if (val.type === 'todo' && (!val.hasDele) && val.sortTime.year === this.year &&
          val.sortTime.month === this.month && val.sortTime.day === this.day) {
          tempDayTodo.push({key: +key, data: val})
        }
      })
      // 对遍历的结果，根据时间戳的先后进行排序
      tempDayTodo.sort((a, b) => {
        return a.key - b.key
      })
      this.thatDayTodo = tempDayTodo
    },
    edit (key) {
      // 编辑模式
      this.showEditKey = true
      this.addOrEdit = 'edit'
      this.editKey = key
    },
    addBtnClick () {
      // 添加模式
      this.showEditKey = true
      this.addOrEdit = 'add'
      this.editKey = 0
    },
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
    toFinished (idx) {
      let key = this.notFinished[idx].key
      let data = this.notFinished[idx].data
      // 修改对象
      data.hasFinished = true
      // 存入localStorage
      localStorage.set(key, data)
    },
    toUnfinished (idx) {
      let key = this.hasFinished[idx].key
      let data = this.hasFinished[idx].data
      // 修改对象
      data.hasFinished = false
      // 存入localStorage
      localStorage.set(key, data)
    },
    importantChange (idx) {
      let key = this.notFinished[idx].key
      let data = this.notFinished[idx].data
      // 修改对象
      data.isImportant = !data.isImportant
      // 存入localStorage
      localStorage.set(key, data)
    },
    removeItem (key) {
      console.log('元素传来的' + key)
      this.thatDayTodo.forEach((item, idx) => {
        if (item.key === key) {
          item.data.hasDele = true
          this.thatDayTodo.splice(idx, 1)
          localStorage.set(item.key, item.data)
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container
    margin .3rem .2rem
    font-size .32rem
    h3
      margin .2rem 0
      color #666
    .todo-list
      li
        background-color #fff
        min-height .85rem
        display flex
        justify-content space-between
        padding .15rem 0
        border-radius .1rem
        margin .2rem 0
        position relative
        transition-property transform
        transition-duration 100ms
        transition-timing-function ease-in
        div
          flex 1 1 auto
          display inline-flex
          align-items center
          line-height 1.3
        .desc
          display flex
          flex-direction column
          justify-content center
          align-items flex-start
          span
            flex 1 1 auto
          .important-desc
            color gray
        .todo-tag
          margin 0 .25rem
          flex 0 0 auto
          font-size .4rem
        .important-tag
          margin 0 .25rem
          flex 0 0 auto
          font-size .4rem
        .dele-btn
          position absolute
          display inline-block
          width .8rem
          height .8rem
          line-height .8rem
          top 50%
          right -1rem
          margin-top -0.4rem
          text-align center
          border-radius .4rem
          font-size .4rem
          color #fff
          background-color #f20c00
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
