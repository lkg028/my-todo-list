<template>
  <div class="slider-item-group"><slot></slot></div>
</template>
<script>
export default {
  data () {
    return {
      itemWidth: 0,
      hasDrag: false,
      mouseKey: false,
      touchKey: false,
      dragStartKey: false,
      dragStartX: 0,
      dragEndX: 0,
      deltaX: 0
    }
  },
  mounted () {
    console.log('这里是slider-item-group')
    console.log('子组件的个数为' + this.$children.length)
  },
  methods: {
    // 初始化宽度：slider-item-group宽度，item宽度(由父组件slider触发执行)
    initWidth (itemWidth) {
      if (!itemWidth) return
      // 记录宽度
      this.itemWidth = itemWidth
      // 设置item-group的宽度
      this.$el.style.width = itemWidth * this.$children.length + 'px'
      // 设置item-group的X偏移
      this.$el.style.transform = `translate3d(${-itemWidth}px, 0, 0)`
      // 通知item修改宽度
      this.$children.forEach((item, idx) => {
        console.log(idx)
        item.itemWidth = itemWidth
        item.$el.style.width = itemWidth + 'px'
      })
      // 初始化拖拽事件
      if (!this.hasDrag) this.initDragEvent()
    },
    initDragEvent () {
      this.hasDrag = true
      // 监听鼠标
      this.$el.addEventListener('touchstart', this.dragStart, false)
      this.$el.addEventListener('touchmove', this.dragMove, false)
      this.$el.addEventListener('touchend', this.dragEnd, false)
      // 监听触摸
      // this.$el.addEventListener('mousedown', this.dragStart, false)
      // this.$el.addEventListener('mousemove', this.dragMove, false)
      // this.$el.addEventListener('mouseup', this.dragEnd, false)
      // this.$el.addEventListener('mouseleave', this.dragEnd, false)
    },
    dragStart (e) {
      this.dragStartKey = true
      if (e.type === 'mousedown') {
        this.mouseKey = true
      } else if (e.type === 'touchstart') {
        this.touchKey = true
      }
    },
    dragMove (e) {
      //  阻止浏览器默认事件
      e.preventDefault()
      if (!this.dragStartKey) return
      if (e.type === 'mousedown' && !this.mouseKey) return
      if (e.type === 'touchstart' && !this.touchKey) return
      // 记录开始值
      let screenX = this.mouseKey ? e.screenX : e.changedTouches[0].screenX
      if (!this.dragStartX) this.dragStartX = screenX
      // 记录差值
      this.deltaX = screenX - this.dragStartX
      // 关闭过渡，跟随鼠标/触摸
      this.$el.style.transitionDuration = '0ms'
      // 设置item-group的X偏移
      this.$el.style.transform = `translate3d(${-this.itemWidth + this.deltaX}px, 0, 0)`
    },
    dragEnd (e) {
      if (!this.dragStartKey) return
      // 恢复过渡
      this.$el.style.transitionDuration = '300ms'
      if (Math.abs(this.deltaX) > this.itemWidth * 0.15) {
        // 超过阈值就切换
        if (this.deltaX > 0) {
          this.pre()
        } else {
          this.next()
        }
      } else {
        //  没有超过阈值就归位
        this.$el.style.transform = `translate3d(${-this.itemWidth}px, 0, 0)`
      }
      // 关闭开关
      this.dragStartKey = false
      this.mouseKey = false
      this.touchKey = false
      // 归零dragStartX、deltaX
      this.dragStartX = 0
      this.deltaX = 0
    },
    pre () {
      //  恢复过渡
      this.$el.style.transitionDuration = '300ms'
      // 减少x偏移
      this.$el.style.transform = `translate3d(${-this.itemWidth + this.itemWidth}px, 0, 0)`
      // 通知上级修改数据
      this.$emit('now', 'left')
      // 过渡完了马上归中
      setTimeout(() => {
        this.$el.style.transitionDuration = '0ms'
        this.$el.style.transform = `translate3d(${-this.itemWidth}px, 0, 0)`
      }, 310)
    },
    next () {
      //  恢复过渡
      this.$el.style.transitionDuration = '300ms'
      // 增加x偏移
      this.$el.style.transform = `translate3d(${-this.itemWidth - this.itemWidth}px, 0, 0)`
      // 通知上级修改数据
      this.$emit('now', 'right')
      // 过渡完了马上归中
      setTimeout(() => {
        this.$el.style.transitionDuration = '0ms'
        this.$el.style.transform = `translate3d(${-this.itemWidth}px, 0, 0)`
      }, 320)
    }
  }

}
</script>
<style lang="stylus" scoped>
  .slider-item-group
    white-space nowrap
    font-size 0
    transform translate3d(-355px, 0, 0)
    transition-duration 300ms
    transition-property transform
    transition-timing-function ease-in
</style>
