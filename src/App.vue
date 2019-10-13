<template>
  <div id="app">
    <app-bar></app-bar>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    appBar: () => import('@/components/appBar')
  }
}
</script>

<style lang="stylus" scoped>
  #app
    padding 1rem 0 1.2rem
</style>
