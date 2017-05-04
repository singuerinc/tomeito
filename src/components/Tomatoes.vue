<template>
  <tomato></tomato>
</template>

<script>
  import store from '../store'
  import Tomato from './Tomato'
  import Timer from '../timer'

  export default {
    name: 'tomatoes',
    store,
    components: {
      tomato: Tomato
    },
    data () {
      return {
        type: -1,
        tick: null,
        tone: null
      }
    },
    beforeCreate () {
      this.$store.dispatch('loadPreferences')
      this.$store.dispatch('initTimer')
    },
    created () {
      this.init = new Audio()
      this.init.src = 'static/init.mp3'
      // this.init.volume = this.$store.getters.volumeLevel

      this.tone = new Audio()
      this.tone.src = 'static/tone.mp3'
      // this.tone.volume = this.$store.getters.volumeLevel

      this.tick = new Audio()
      this.tick.src = 'static/tick.mp3'
      this.tick.volume = this.$store.getters.volumeLevel
      this.tick.loop = true

      this.$store.state.bus.$on('completed', (timer) => {
        this.tick.pause()
        this.onTimerComplete(timer, false)
      })

      this.$store.state.bus.$on('init', () => {
        this.init.play()
      })

      this.$store.state.bus.$on('started', () => {
        this.tick.play()
      })

      this.$store.state.bus.$on('paused', () => {
        this.tick.pause()
      })

      this.$store.state.bus.$on('skipped', (timer) => {
        this.tick.pause()
        this.onTimerComplete(timer, true)
      })
    },
    beforeDestroy () {

    },
    watch: {
      '$store.state.volume': function () {
        this.tick.volume = this.$store.getters.volumeLevel
      }
    },
    methods: {
      onTimerComplete (prevTimer, skip) {
        if (!skip && (prevTimer && prevTimer.type === Timer.TYPE_TOMATO)) {
          this.$store.commit('addTimer', prevTimer)
        }

        if (!skip && prevTimer) {
          this.tone.play()
        }

        this.$store.dispatch('initTimer')
      }
    }
  }
</script>
<style scoped>
</style>
