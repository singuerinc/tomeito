<template>
  <div>
    <ul>
      <li class="with-tooltip" @click.stop="setVolume(!volume)">
        <div class="btn btn-volume-on" v-show="volume === true">
          <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <div class="btn btn-volume-off" v-show="volume === false">
          <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <span>Tick sound</span>
      </li>
      <li class="with-tooltip" @click.stop="setAlwaysOnTop(!alwaysOnTop)">
        <div class="btn btn-always-on-top-on" v-show="alwaysOnTop === true">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
        </div>
        <div class="btn btn-always-on-top-off" v-show="alwaysOnTop === false">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43zm-.45-4.72L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88zM3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/>
          </svg>
        </div>
        <span>On top</span>
      </li>
      <li class="with-tooltip" @click.stop="setAutoPlay(!autoPlay)">
        <div class="btn btn-auto-play-on" v-show="autoPlay === true">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <div class="btn btn-auto-play-off" v-show="autoPlay === false">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none"/>
            <path d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33zm-7.14-.94l2.36 2.36C4.45 8.99 4 10.44 4 12c0 2.21.91 4.2 2.36 5.64L4 20h6v-6l-2.24 2.24C6.68 15.15 6 13.66 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14 2.86 5.41zM20 4h-6v6l2.24-2.24C17.32 8.85 18 10.34 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46C19.55 15.01 20 13.56 20 12c0-2.21-.91-4.2-2.36-5.64L20 4z"/>
          </svg>
        </div>
        <span>Auto play</span>
      </li>
      <li>
        <div class="btn btn-settings" @click.stop="closeSettings()">
          <svg fill="#000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import router from '../router'
  import { mapState, mapMutations } from 'vuex'
  import store from '../store'

  export default {
    name: 'settings',
    router,
    store,
    methods: {
      ...mapMutations([
        'setVolume',
        'setAlwaysOnTop',
        'setAutoPlay'
      ]),
      closeSettings () {
        this.$emit('close')
      }
    },
    computed: {
      ...mapState({
        volume: state => state.volume,
        alwaysOnTop: state => state.alwaysOnTop,
        autoPlay: state => state.autoPlay
      })
    }
  }
</script>
<style scoped>
  ul {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: grey;
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ul li {
    margin: 0;
    padding: 0;
    display: inline-block;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  .btn {
    padding: 7px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0);
    transition-property: opacity, width, background-color;
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

  ul li.with-tooltip:hover .btn {
    width: 100px;
  }

  ul li.with-tooltip span {
    position: absolute;
    top: 0;
    left: 30px;
    color: white;
    height: 30px;
    width: 110px;
    font-size: 8px;
    line-height: 31px;
    text-transform: uppercase;
}

</style>
