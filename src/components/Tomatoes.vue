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
    created () {
      this.$store.state.bus.$on('complete', () => {
        this.onTimerComplete()
      })
      this.onTimerComplete()
    },
    methods: {
      onTimerComplete () {
        const timer = new Timer({bus: this.$store.state.bus})
        this.$store.state.tomato = timer
        this.$store.state.tomatoes.push(timer)
      }
    }
  }
</script>
<style scoped>
</style>
