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
        tick: null
      }
    },
    beforeCreate () {
      this.$store.dispatch('loadPreferences')
    },
    created () {
      this.tick = new Audio()
      this.tick.src = 'static/tick.mp3'
      this.tick.loop = true

      this.$store.state.bus.$on('completed', (timer) => {
        this.tick.pause()
        this.onTimerComplete(timer, false)
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
      '$store.state.volume': function (value) {
        this.tick.volume = value ? 0.5 : 0
      }
    },
    methods: {
      onTimerComplete (prevTimer, skip) {
        if (!skip && (prevTimer && prevTimer.type === Timer.TYPE_TOMATO)) {
          this.$store.commit('addTimer', prevTimer)
        }

        if (!skip && prevTimer) {
          const audio = new Audio()
          audio.src = 'static/tone.mp3'
          audio.play()
        }

        this.type = this.type * -1

        const type = this.type === 1 ? Timer.TYPE_TOMATO : Timer.TYPE_BREAK

        const timer = new Timer({type, bus: this.$store.state.bus})
        this.$store.commit('setCurrentTimer', timer)

        if (this.$store.state.auto) {
          timer.play()
        }
      }
    }
  }
</script>
<style scoped>
</style>
