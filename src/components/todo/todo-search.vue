<template>
  <div class="search">
    <!-- 这里显示全部的、未删除的事项 -->
    <template v-if="allTodo.length">
      <div v-for="(item, idx) in dateKeys" v-bind:key="idx">
        <h3>{{item.year}}年{{item.month}}月{{item.day}}日</h3>
        <todo-item v-for="item in allTodo[idx]" :todoItem="item.data" @desc-click="edit(item.key)"
        @updateItem="updateItem(item.key, $event)" v-bind:key="item.key"></todo-item>
      </div>
    </template>
    <!-- 没有事项时显示的内容 -->
    <template v-if="!allTodo.length">
      <p style="text-align:center">{{emptyDesc}}</p>
    </template>
    <!-- 编辑模块 -->
    <add v-bind:add-or-edit="addOrEdit" v-bind:edit-key="editKey" @submit="closeEdit" v-show="showEditKey"></add>
  </div>
</template>
<script>
import util from '@/util.js'
let {localStorage} = util
export default {
  components: {
    todoItem: () => import('./todo-item'),
    add: () => import('./add')
  },
  data () {
    return {
      allTodo: [],
      importantTodo: [],
      dateKeys: [],
      // 编辑模块数据
      addOrEdit: '',
      editKey: 0,
      showEditKey: false
    }
  },
  computed: {
    queryStr () {
      return this.$route.query.q
    },
    emptyDesc () {
      let temp = ''
      if (this.queryStr === 'all') temp = 'nice！所有的事情都搞定了'
      if (this.queryStr === 'finished') temp = '太懒了！还没有完成的事项'
      if (this.queryStr === 'dele') temp = '暂时没有删除的事项'
      return temp
    }
  },
  methods: {
    initData () {
      let allTodo = []
      let importantTodo = []
      let tempArr = []
      let tempAllTodo = []
      switch (this.queryStr) {
        case 'all':
          localStorage.each((val, key) => {
            if (!val.hasDele && !val.hasFinished && val.type === 'todo') {
              tempAllTodo.push({key: +key, data: val})
              tempArr.push(JSON.stringify(val.sortTime))
            }
          })
          break
        case 'finished':
          localStorage.each((val, key) => {
            if (!val.hasDele && val.hasFinished && val.type === 'todo') {
              tempAllTodo.push({key: +key, data: val})
              tempArr.push(JSON.stringify(val.sortTime))
            }
          })
          break
        case 'dele':
          localStorage.each((val, key) => {
            if (val.hasDele && val.type === 'todo') {
              tempAllTodo.push({key: +key, data: val})
              tempArr.push(JSON.stringify(val.sortTime))
            }
          })
          break
      }

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
    },
    updateItem (key, newData) {
      this.allTodo.forEach((dayTodos) => {
        for (let [idx, item] of dayTodos.entries()) {
          if (item.key === key) {
            if (newData.hasDele) dayTodos.splice(idx, 1)
            else dayTodos.splice(idx, 1, {key, data: newData})
          }
        }
      })
      localStorage.set(key, newData)
    },
    edit (key) {
      console.log('这里是search页面，key为：' + key)
      this.editKey = key
      this.addOrEdit = 'edit'
      this.showEditKey = true
    },
    closeEdit (newData) {
      // 提交数据，关闭编辑板块
      if (newData) {
        localStorage.set(this.editKey, newData)
        this.allTodo.forEach((dayTodos) => {
          for (let [idx, item] of dayTodos.entries()) {
            if (item.key === this.editKey) {
              if (newData.hasDele) dayTodos.splice(idx, 1)
              else dayTodos.splice(idx, 1, {key: this.editKey, data: newData})
            }
          }
        })
      }
      this.showEditKey = false
      this.addOrEdit = ''
      this.editKey = 0
    }
  }, // methods结束
  mounted () {
    this.initData()
  },
  beforeUpdate () {
    this.initData()
  },
  activated () {
    this.initData()
  }
}
</script>
<style lang="stylus" scoped>
  .search
    padding  0.2rem .2rem
    .todo-list
      overflow hidden
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
