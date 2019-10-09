<template>
  <div class="container">
    <calendar></calendar>
    <todo></todo>
  </div>
</template>
<script>
import Calendar from './components/Calendar'
import Todo from '../todo/Todo'
export default {
  components: {
    Calendar,
    Todo
  }
}
</script>
<style lang="stylus" scoped>

</style>
