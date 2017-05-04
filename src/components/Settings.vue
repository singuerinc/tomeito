<template>
  <div>
    <ul>
      <li>
        <div class="btn btn-volume-on" v-show="volume === true" @click.stop="setVolume(false)">
          <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <div class="btn btn-volume-off" v-show="volume === false" @click.stop="setVolume(true)">
          <svg fill="#ffffff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
      </li>
      <li>
        <div class="btn btn-always-on-top-on" v-show="alwaysOnTop === true" @click.stop="setAlwaysOnTop(false)">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
        </div>
        <div class="btn btn-always-on-top-off" v-show="alwaysOnTop === false" @click.stop="setAlwaysOnTop(true)">
          <svg fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43zm-.45-4.72L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88zM3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/>
          </svg>
        </div>
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
        'setAlwaysOnTop'
      ]),
      closeSettings () {
        this.$emit('close')
      }
    },
    computed: {
      ...mapState({
        volume: state => state.volume,
        alwaysOnTop: state => state.alwaysOnTop
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
  }

  .btn {
    cursor: pointer;
    padding: 7px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0);
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
</style>
