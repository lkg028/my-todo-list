<template>
  <div class="wrap">
    <div class="item-container" :class="{'has-finished': todoItem.hasFinished}" v-swipeout>
      <div class="todo-tag iconfont" @click="toggleFinished">&#xe60d;</div>
      <div class="desc" @click="descClick">
        <span class="desc-text">{{todoItem.desc}}</span>
        <span class="desc-tag">{{todoItem.isImportant ? '重要任务' : '一般任务'}}</span>
      </div>
      <div class="important-tag iconfont" @click="toggleImportant">
        {{todoItem.isImportant ? '&#xe605;' : '&#xe600;'}}
      </div>
      <div class="dele-or-restore iconfont" @click="toggleItem"
        :class="{'has-dele': todoItem.hasDele}"
      >
        {{todoItem.hasDele ? '&#xe7cd;' : '&#xe652;'}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    todoItem: {
      type: Object,
      default: () => { return {} }
    }
  },
  methods: {
    // 完成/进行中切换
    toggleFinished () {
      let newItem = JSON.parse(JSON.stringify(this.todoItem))
      newItem.hasFinished = !newItem.hasFinished
      this.$emit('updateItem', newItem)
    },
    // 重要/非重要切换
    toggleImportant () {
      if (this.todoItem.hasFinished) return
      let newItem = JSON.parse(JSON.stringify(this.todoItem))
      newItem.isImportant = !newItem.isImportant
      this.$emit('updateItem', newItem)
    },
    // 删除/恢复切换
    toggleItem () {
      let newItem = JSON.parse(JSON.stringify(this.todoItem))
      newItem.hasDele = !newItem.hasDele
      this.$emit('updateItem', newItem)
    },
    // 点击文本的时候，向外促发编辑事件
    descClick () {
      this.$emit('desc-click')
    }
  },
  directives: {
    // 整体拖拽功能
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
  }
}
</script>
<style lang="stylus" scoped>
  .wrap
    overflow hidden
    .has-finished
      color gray
    .item-container
      background-color #fff
      min-height .85rem
      width 100%
      display flex
      justify-content space-between
      padding .15rem 0
      border-radius .1rem
      margin .1rem 0
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
        .desc-tag
          color gray
      .todo-tag
        padding 0 .25rem
        flex 0 0 auto
        font-size .4rem
      .important-tag
        padding 0 .25rem
        flex 0 0 auto
        font-size .4rem
      .dele-or-restore
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
      .has-dele
        background-color #419dff
</style>
