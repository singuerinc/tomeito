<template>
  <div class="tomato" v-bind:class="typeName">
    <ul class="tomatoes">
      <li v-for="item in tomatoes"></li>
    </ul>
    <div class="progress">
      <div class="inner" :style="{'width': width}"></div>
    </div>

    <div class="time">{{time}}</div>
    <!--<h2>{{initTime}}</h2>-->
    <!--<h2>{{currentTime}}</h2>-->
    <!--<h2>{{endTime}}</h2>-->
    <!--<h2>{{progress}}</h2>-->
    <div class="btn btn-play" v-show="!isRunning" @click.stop="playPause()">
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-pause" v-show="isRunning" @click.stop="playPause()">
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-fast-forward" v-show="isRunning" @click.stop="skip()">
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-reset" v-show="!isRunning && $store.state.timer.progress !== 0" @click.stop="$store.state.timer.reset()">
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
      </svg>
    </div>
  </div>
</template>

<script>
  import format from 'date-fns/format'
  import store from '../store'
  import Timer from '../timer'

  export default {
    name: 'tomato',
    store,
    methods: {
      playPause: () => {
        if (store.state.timer.isRunning()) {
          store.state.timer.pause()
        } else {
          store.state.timer.play()
        }
      },
      skip () {
        store.state.timer.skip()
      }
    },
    computed: {
      time () {
        return format(new Date(store.state.timer.time), 'mm:ss')
      },
      initTime () {
        return store.state.timer.initTime
      },
      currentTime () {
        return store.state.timer.currentTime
      },
      endTime () {
        return store.state.timer.endTime
      },
      progress () {
        return store.state.timer.progress
      },
      width () {
        return `${100 * store.state.timer.progress}%`
      },
      tomatoes () {
        return store.state.tomatoes
      },
      isRunning () {
        return store.state.timer.isRunning()
      },
      isBreak () {
        return store.state.timer.type === Timer.TYPE_BREAK
      },
      typeName () {
        if (!store.state.timer.isRunning()) {
          return 'type-idle'
        } else if (store.state.timer.type === Timer.TYPE_TOMATO) {
          return 'type-tomato'
        } else if (store.state.timer.type === Timer.TYPE_BREAK) {
          return 'type-break'
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .type-idle {
    --main-color-1: #ddd;
    --main-color-2: #ddd;
    --time-color: #9e9e9e;
  }

  .type-tomato {
    --main-color-1: #ab000d;
    --main-color-2: #e53935;
    --time-color: #ef9a9a;
  }

  .type-break {
    --main-color-1: #387002;
    --main-color-2: #689f38;
    --time-color: #8BC34A;
  }

  * {
    box-sizing: border-box;
  }

  .progress {
    display: block;
    height: 30px;
    width: 100%;
    background-color: var(--main-color-2);
    margin: 0 auto;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    transition-property: background-color;
    transition-duration: 500ms;
  }

  .progress .inner {
    display: block;
    height: 30px;
    width: 100%;
    background-color: var(--main-color-1);
    transition-property: width, background-color;
    transition-duration: 250ms;
  }

  .tomatoes {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 2px;
    left: 58px;
    z-index: 1;
  }

  .tomatoes li {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background: black;
    opacity: 0.2;
    display: inline-block;
    margin: 0 2px;
  }

  .time {
    position: absolute;
    top: 5px;
    left: 8px;
    color: var(--time-color);
  }

  .tomato:hover .btn {
    opacity: 1;
  }

  .btn {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0);
    opacity: 0;
    transition-property: opacity, background-color;
    transition-duration: 500ms;
  }

  .btn svg {
    opacity: 0.8;
    margin: 0;
    padding: 0;
  }

  .btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .btn.btn-play, .btn.btn-pause {
  }

  .btn.btn-reset, .btn.btn-fast-forward {
    right: 30px;
  }

  h1, h2 {
    font-weight: normal;
    margin: 0 0;
  }
</style>
