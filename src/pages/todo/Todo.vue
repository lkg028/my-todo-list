<template>
  <div class="container">
    <!-- 根据所选的日期，渲染出当前日期所有代办事项以及已经完成的事项 -->
    <h3>待处理</h3>
    <ul class="todo-list">
      <li v-for="(item, idx) in notFinished" v-bind:key="item.key">
        <span class="todo-tag iconfont" @click="toFinished(idx)">&#xe71e;</span>
        <span @click="edit(item.key)"  class="desc">
          {{item.data.desc}}<br>{{item.data.isImportant ? '重要任务' : '一般任务'}}
        </span>
        <span class="important-tag iconfont" @click="importantChange(idx)">
          {{item.data.isImportant ? '&#xe605;' : '&#xe600;'}}
        </span>
      </li>
    </ul>
    <h3>已完成</h3>
    <ul class="todo-list finished">
      <li v-for="(item, idx) in hasFinished" v-bind:key="item.key">
        <span class="todo-tag iconfont" @click="toUnfinished(idx)">&#xe60d;</span>
        <span class="desc">
          {{item.data.desc}}<br>{{item.data.isImportant ? '重要任务' : '一般任务'}}
        </span>
        <span class="important-tag iconfont">
          {{item.data.isImportant ? '&#xe605;' : '&#xe600;'}}
        </span>
      </li>
    </ul>
    <!-- 输入区域 -->
    <add v-bind:add-or-edit="addOrEdit" v-bind:edit-key="editKey" @submit="closeEdit" v-show="showEditKey"></add>
    <!-- 添加按钮 -->
    <span class="add-todo-btn iconfont" v-show="!showEditKey" @click="addBtnClick">&#xe692;</span>
  </div>
</template>
<script>
import util from '@/util.js'
import add from './add'
import { mapState } from 'vuex'
let {localStorage} = util
export default {
  components: {
    add
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
    }
  },
  created () {
    console.log(localStorage)
    //  需要优化，没有数据的时候，存一条测试信息进去
    localStorage.set('1570467988001', {
      type: 'todo',
      sortTime: {year: 2019, month: 10, day: 8},
      isImportant: false,
      desc: '海南粉腌粉配老干妈',
      hasFinished: true,
      hasDele: false
    })
    localStorage.set('1570467988241', {
      type: 'todo',
      sortTime: {year: 2019, month: 10, day: 8},
      isImportant: true,
      desc: '吃油条配豆浆',
      hasFinished: false,
      hasDele: false
    })
    localStorage.set('1570467988299', {
      type: 'todo',
      sortTime: {year: 2019, month: 10, day: 8},
      isImportant: true,
      desc: '这条是已经删除的todo',
      hasFinished: false,
      hasDele: true
    })
    // 初始化数据，把数据从localStorage中读取出来，存储到data中
    this.initThatDayTodo()
  },
  methods: {
    initThatDayTodo () {
      let tempDayTodo = []
      localStorage.each((val, key) => {
        console.log(!val.hasDele)
        if (val.type === 'todo' && (!val.hasDele) && val.sortTime.year === this.year &&
          val.sortTime.month === this.month && val.sortTime.day === this.day) {
          tempDayTodo.push({key: +key, data: val})
          console.log('数据被存储了')
        }
      })
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
        span
          flex 1 1 auto
          display inline-flex
          align-items center
          line-height 1.2
        .todo-tag
          margin 0 .25rem
          flex 0 0 auto
          font-size .4rem
        .important-tag
          margin 0 .25rem
          flex 0 0 auto
          font-size .4rem
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
