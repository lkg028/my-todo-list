<template>
  <div class="container">
    <calendar></calendar>
    <todo></todo>
  </div>
</template>
<script>
export default {
  components: {
    Calendar: () => import('./components/Calendar'),
    Todo: () => import('../todo/Todo')
  }
}
</script>
<style lang="stylus" scoped>

</style>
