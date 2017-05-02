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
      this.$store.state.bus.$on('complete', () => {
        this.onTimerComplete()
      })
      this.onTimerComplete()
    },
    methods: {
      onTimerComplete () {
        // UI: https://dribbble.com/shots/2927583-Pomodoro-timer
        this.type = this.type * -1

        const type = this.type === 1 ? Timer.TYPE_TOMATO : Timer.TYPE_BREAK

        const timer = new Timer({type, bus: this.$store.state.bus})
        this.$store.state.timer = timer
        this.$store.state.tomatoes.push(timer)
        if (this.$store.state.auto) {
          timer.play()
        }
      }
    }
  }
</script>
<style scoped>
</style>
