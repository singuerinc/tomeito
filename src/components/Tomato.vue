<template>
  <div class="tomato" v-bind:class="typeName">
    <ul class="tomatoes">
      <li v-for="(item, index) in tomatoes" v-bind:class="{'space': (index !== 0 && index % 4 === 0) }"></li>
      <li class="current" v-show="isTomato && progress !== 0" v-bind:class="{'pulse': isRunning}"></li>
    </ul>
    <div class="progress">
      <div class="inner" :style="{'width': width}"></div>
    </div>
    <div class="time">{{time}}</div>
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
    <div class="btn btn-reset" v-show="!isRunning && progress !== 0"
         @click.stop="reset()">
      <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path
          d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
      </svg>
    </div>
    <settings v-show="showSettings" v-on:close="showSettings=false"></settings>
  </div>
</template>

<script>
  import format from 'date-fns/format'
  import store from '../store'
  import router from '../router'
  import Timer from '../timer'
  import Settings from './Settings.vue'
  import { mapState, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'tomato',
    store,
    router,
    components: {
      'settings': Settings
    },
    data () {
      return {
        showSettings: false
      }
    },
    methods: {
      ...mapMutations([
        'setVolume'
      ]),
      playPause: function () {
        if (this.$store.state.timer.isRunning()) {
          this.$store.commit('GA_event', {
            evCategory: 'btn',
            evAction: 'pause'
          })
          this.$store.state.timer.pause()
        } else {
          this.$store.commit('GA_event', {
            evCategory: 'btn',
            evAction: 'play'
          })
          this.$store.state.timer.play()
        }
      },
      reset () {
        this.$store.commit('GA_event', {
          evCategory: 'btn',
          evAction: 'reset'
        })
        this.$store.state.timer.reset(true)
      },
      skip () {
        this.$store.commit('GA_event', {
          evCategory: 'btn',
          evAction: 'skip'
        })
        this.$store.state.timer.skip()
      },
      openSettings () {
        this.$store.commit('GA_event', {
          evCategory: 'settings',
          evAction: 'open'
        })
        this.showSettings = true
      }
    },
    computed: {
      ...mapGetters([
        'tomatoes'
      ]),
      ...mapState({
        volume: state => state.volume,
        initTime: state => state.timer.initTime,
        currentTime: state => state.timer.currentTime,
        endTime: state => state.timer.endTime,
        progress: state => state.timer.progress,
        isRunning: state => state.timer.isRunning(),
        isBreak: state => state.timer.type === Timer.TYPE_BREAK,
        isTomato: state => state.timer.type === Timer.TYPE_TOMATO,
        time (state) {
          return format(new Date(state.timer.time), 'mm:ss')
        },
        width () {
          return `${100 * this.progress}%`
        },
        typeName (state) {
          if (!state.timer.isRunning() && state.timer.progress === 0) {
            return 'type-idle'
          } else if (state.timer.type === Timer.TYPE_TOMATO) {
            return 'type-tomato'
          } else if (state.timer.type === Timer.TYPE_LONG_BREAK) {
            return 'type-long-break'
          } else if (state.timer.type === Timer.TYPE_BREAK) {
            return 'type-break'
          }
        }
      })
    }
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

  .type-long-break {
    --main-color-1: #3f51b5;
    --main-color-2: #5c6bc0;
    --time-color: #9fa8da;
  }

  .type-break {
    --main-color-1: #387002;
    --main-color-2: #689f38;
    --time-color: #8BC34A;
  }

  .progress {
    pointer-events: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;
    margin: 0 auto;
    background-color: var(--main-color-2);
    text-align: left;
    transition-property: background-color;
    transition-duration: 500ms;
  }

  .progress .inner {
    display: block;
    height: 30px;
    width: 100%;
    background-color: var(--main-color-1);
    transition-property: width, background-color;
    transition-duration: 500ms;
  }

  .tomatoes {
    pointer-events: none;
    position: relative;
    top: 0;
    left: 58px;
    margin: 0;
    padding: 0;
    z-index: 1;
    list-style-type: none;
    overflow: hidden;
  }

  .tomatoes li {
    list-style-type: none;
    display: block;
    width: 4px;
    height: 4px;
    margin: 13px 2px;
    border-radius: 100%;
    background: black;
    opacity: 0.2;
    float: left;
  }

  .tomatoes li.space {
    margin: 13px 2px 13px 6px;
  }

  @keyframes fade {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 0.2;
    }
  }

  .tomatoes li.current.pulse {
    animation: fade 2s infinite;
  }

  .time {
    pointer-events: none;
    font-size: 17px;
    position: absolute;
    top: 4px;
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
    /* opacity: 0; */
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

  .btn-settings {
    right: 0;
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
</style>
