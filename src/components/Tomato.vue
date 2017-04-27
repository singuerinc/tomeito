<template>
  <div>
    <ul class="tomatoes">
      <li v-for="item in tomatoes"></li>
    </ul>
    <div class="progress">
      <div class="inner" :style="{'width': width}"></div>
    </div>
    <!--<h2>{{initTime}}</h2>-->
    <!--<h2>{{currentTime}}</h2>-->
    <!--<h2>{{endTime}}</h2>-->
    <!--<h2>{{progress}}</h2>-->
    <button @click.stop="$store.state.tomato.play()">start</button>
    <button @click.stop="$store.state.tomato.pause()">pause</button>
    <button @click.stop="$store.state.tomato.reset()">reset</button>
  </div>
</template>

<script>
  import store from '../store'

  export default {
    name: 'tomato',
    store,
    computed: {
      initTime () {
        return this.$store.state.tomato.initTime
      },
      currentTime () {
        return this.$store.state.tomato.currentTime
      },
      endTime () {
        return this.$store.state.tomato.endTime
      },
      progress () {
        return this.$store.state.tomato.progress
      },
      width () {
        return `${400 * this.$store.state.tomato.progress}px`
      },
      tomatoes () {
        return this.$store.state.tomatoes
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .progress {
    display: block;
    height: 50px;
    width: 400px;
    background: black;
    margin: 0 auto;
    text-align: left;
  }

  .progress .inner {
    display: block;
    height: 50px;
    width: 400px;
    background: grey;
  }

  .tomatoes {
    margin: 0;
    padding: 0;
  }

  .tomatoes li {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: red;
  }

  h1, h2 {
    font-weight: normal;
    margin: 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
