<template>
  <div>
    <tomato></tomato>
  </div>
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
        type: -1
      }
    },
    created () {
      this.$store.state.bus.$on('completed', (timer) => {
        this.onTimerComplete(timer, false)
      })

      this.$store.state.bus.$on('skipped', (timer) => {
        this.onTimerComplete(timer, true)
      })

      this.onTimerComplete(null, false)
    },
    methods: {
      onTimerComplete (prevTimer, skip) {
        if (!skip && (prevTimer && prevTimer.type === Timer.TYPE_TOMATO)) {
          const audio = new Audio()
          audio.src = 'static/tone.mp3'
          audio.play()

          this.$store.state.tomatoes.push(prevTimer)
        }

        this.type = this.type * -1

        const type = this.type === 1 ? Timer.TYPE_TOMATO : Timer.TYPE_BREAK

        const timer = new Timer({type, bus: this.$store.state.bus})
        this.$store.state.timer = timer

        if (this.$store.state.auto) {
          timer.play()
        }
      }
    }
  }
</script>
<style scoped>
</style>
