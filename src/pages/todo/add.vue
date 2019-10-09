<template>
  <div class="add-todo-item" @click="enFocus">
    <div class="input-wrap">
      <span class="todo-tag iconfont">&#xe71e;</span>
      <input type="text" placeholder="添加任务" v-model="editItem.desc"
          ref="input" autofocus="autofocus" @blur="inputBlurFn"
      >
      <span class="todo-add-btn iconfont" @click="submit('confirm')">&#xe631;</span>
    </div>
    <div class="option">
      <div class="assign-date">
        <span class="iconfont">&#xe632;</span>
        {{year}}年{{month}}月{{day}}日
      </div>
      <div class="important-btn" :class="{important: editItem.isImportant}" @click="importantChange">
        <span class="iconfont">{{editItem.isImportant ? '&#xe605;' : '&#xe600;'}}</span>
        重要
      </div>
      <div class="cancel-btn" @click="submit('cancel')">取消</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import util from '@/util.js'
let {localStorage} = util
export default {
  props: {
    // 三种情况:空''、编辑模式'edit'、添加模式
    addOrEdit: String,
    // 需要编辑的数据时间戳
    editKey: Number
  },
  data () {
    return {
      editItem: {}
    }
  },
  computed: {
    ...mapState(['selectDate', 'year', 'month', 'day', 'week'])
  },
  watch: {
    addOrEdit (val) {
      if (!val) return
      this.init()
    },
    editKey (val) {
      if (!val) return
      this.init()
    }
  },
  methods: {
    init () {
      if (this.editKey) {
        // 编辑模式，自动填入数据
        this.editItem = localStorage.get(this.editKey + '')
      } else {
        // 添加模式，使用默认值
        this.editItem = {
          type: 'todo',
          desc: '',
          hasDele: false,
          hasFinished: false,
          isImportant: false,
          sortTime: {year: this.year, month: this.month, day: this.day}
        }
      }
      this.$refs['input'].focus()
    },
    submit (act) {
      // act为cancel点击了取消按钮，confirm为确认按钮
      let newData = null
      if (act === 'confirm' && this.editItem.desc) newData = this.editItem
      console.log(newData)
      this.$emit('submit', newData)
    },
    importantChange () {
      // 设置为重要/不重要
      this.editItem.isImportant = !this.editItem.isImportant
    },
    enFocus () {
      // 继续获得焦点，避免小键盘隐藏
      this.$refs['input'].focus()
    },
    inputBlurFn () {
      // 输入框失去焦点后20毫秒没有继续获得焦点，立即通知父组件关闭
      setTimeout(() => {
        if (document.activeElement !== this.$refs['input']) this.$emit('submit')
      }, 20)
    }
  }
  // // 生命周期测试
  // beforeCreate () {
  //   console.log('这是是编辑添加组件：beforeCreate')
  // },
  // created () {
  //   console.log('这是是编辑添加组件：created')
  // },
  // beforeMount () {
  //   console.log('这是是编辑添加组件：beforeMount')
  // },
  // mounted () {
  //   console.log('这是是编辑添加组件：mounted')
  // },
  // beforeUpdate () {
  //   // 重新渲染时，初始化数据
  //   console.log('这是是编辑添加组件：beforeUpdate')
  // },
  // updated () {
  //   // 重新渲染时，初始化数据
  //   console.log('这是是编辑添加组件：updated')
  // },
  // beforeDestroy () {
  //   console.log('这是是编辑添加组件：beforeDestroy')
  // },
  // destroyed () {
  //   console.log('这是是编辑添加组件：destroyed')
  // }
}
</script>
<style lang="stylus" scoped>
  .add-todo-item
    box-sizing border-box
    width 100%
    position fixed
    bottom 0
    left 0
    right 0
    background-color #fff
    font-size .32rem
    .input-wrap
      margin .25rem .5rem
      display flex
      justify-content space-between
      align-items center
      span
        font-size .4rem
        color gray
      .todo-tag
        flex 0 0 auto
        margin-right .25rem
      .todo-add-btn
        flex 0 0 auto
        margin-left .25rem
      input
        flex 1 1 auto
    .option
      margin .25rem .5rem
      display flex
      justify-content space-between
      font-size .32rem
      div
        background-color #ededed
        padding .1rem .2rem
        border-radius .4rem
      .assign-date
        color gray
      .cancel-btn
        color red
      .important
        color #fff
        background-color #419dff
</style>
