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
    <div class="btn btn-volume-on" v-show="volume === true" @click.stop="setVolumeOff()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-volume-off" v-show="volume === false" @click.stop="setVolumeOn()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-play" v-show="!isRunning" @click.stop="playPause()">
        <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-pause" v-show="isRunning" @click.stop="playPause()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-fast-forward" v-show="isRunning" @click.stop="skip()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>
    <div class="btn btn-reset" v-show="!isRunning && $store.state.timer.progress !== 0" @click.stop="$store.state.timer.reset()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
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
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'tomato',
    store,
    methods: {
      ...mapMutations([
        'setVolumeOn',
        'setVolumeOff'
      ]),
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
    computed: mapState({
      volume: state => state.volume,
      initTime: state => state.timer.initTime,
      currentTime: state => state.timer.currentTime,
      endTime: state => state.timer.endTime,
      progress: state => state.timer.progress,
      tomatoes: state => state.timer.tomatoes,
      isRunning: state => state.timer.isRunning(),
      isBreak: state => state.timer.type === Timer.TYPE_BREAK,
      time () {
        return format(new Date(store.state.timer.time), 'mm:ss')
      },
      width () {
        return `${100 * this.progress}%`
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
    })
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .type-idle {
    --main-color-1: #666;
    --main-color-2: #666;
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
    padding: 7px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0);
    opacity: 0;
    transition-property: opacity, background-color;
    transition-duration: 500ms;
  }

  .btn svg {
    pointer-events: none;
    opacity: 0.8;
    margin: 0;
    padding: 0;
  }

  .btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .btn-volume-on, .btn-volume-off {
    right: 0;
  }

  .btn.btn-play, .btn.btn-pause {
    right: 30px;
  }

  .btn.btn-reset, .btn.btn-fast-forward {
    right: 60px;
  }

  h1, h2 {
    font-weight: normal;
    margin: 0 0;
  }
</style>
