<template>
  <div class="search">
    <!-- 这里显示全部的、未删除的事项 -->
    <template v-if="showAllKey">
      <div v-for="(item, idx) in dateKeys" v-bind:key="idx">
        <h3>{{item.year}}年{{item.month}}月{{item.day}}日</h3>
        <ul class="todo-list">
          <li v-for="todo in allTodo[idx]" v-bind:key="todo.key">
            <div class="todo-tag iconfont" @click="toFinished(idx)">&#xe71e;</div>
            <div @click="edit(item.key)"  class="desc">
              <span>{{todo.data.desc}}</span>
              <span class="important-desc">{{todo.data.isImportant ? '重要任务' : '一般任务'}}</span>
            </div>
            <div class="important-tag iconfont" @click="importantChange(idx)">
              {{todo.data.isImportant ? '&#xe605;' : '&#xe600;'}}
            </div>
            <div class="dele-btn iconfont" @click="removeItem(item.key)">&#xe652;</div>
          </li>
        </ul>
      </div>
    </template>
    <!-- 这里显示重要事项 -->
    <template v-if="!showAllKey">

    </template>
  </div>
</template>
<script>
import util from '@/util.js'
let {localStorage} = util
export default {
  data () {
    return {
      allTodo: [],
      importantTodo: [],
      dateKeys: []
    }
  },
  computed: {
    showAllKey () {
      return this.$route.query.q === 'all'
    }
  },
  methods: {
    initData () {
      let allTodo = []
      let importantTodo = []
      let tempArr = []
      let tempAllTodo = []
      localStorage.each((val, key) => {
        if (!val.hasDele && !val.hasFinished && val.type === 'todo') {
          tempAllTodo.push({key: key, data: val})
          tempArr.push(JSON.stringify(val.sortTime))
        }
      })
      // 时间去重
      tempArr = [...new Set(tempArr)]
      // 时间排序
      tempArr.forEach((item, idx) => {
        tempArr[idx] = JSON.parse(item)
      })
      // 排序
      tempArr.sort((a, b) => {
        return new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day)
      })
      // 根据时间分配数据
      tempArr.forEach((item, idx) => {
        let {year, month, day} = item
        allTodo[idx] = []
        importantTodo[idx] = []
        tempAllTodo.forEach((item) => {
          let {year: itemYear, month: itemMonth, day: itemDay} = item.data.sortTime
          if (itemYear === year && itemMonth === month && itemDay === day) {
            allTodo[idx].push(item)
            if (item.data.isImportant) importantTodo[idx].push(item)
          }
        })
      })
      this.dateKeys = tempArr
      this.allTodo = allTodo
      this.importantTodo = importantTodo
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style lang="stylus" scoped>
  .search
    padding  0.2rem .2rem
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
</style>
