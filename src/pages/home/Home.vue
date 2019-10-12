<template>
  <div class="container">
    <calendar></calendar>
    <!-- todo组件接收参数：短日期[sortTime: {year：2019, month: 10, day: 10}...] 数组-->
    <!-- 如果长度为1，只显示当天，如果超过1，显示为多天 -->
    <!-- 多天情况下：筛选参数showFinished、showDelete -->
    <todo v-bind:days="days"></todo>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    Calendar: () => import('./components/calendar/Calendar'),
    Todo: () => import('@/components/todo/Todo')
  },
  computed: {
    ...mapGetters(['selectSortTime']), // {year, month, day}
    days () {
      return [this.selectSortTime]
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
