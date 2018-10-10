import Vue from 'vue'
import Vuex from 'vuex'
import Timer from './timer'
import * as preferences from 'store'
import { ipcRenderer } from 'electron'
import Analytics from 'electron-google-analytics'
import { version } from '../../package.json'

Vue.use(Vuex)

const bus = new Vue()
const analytics = new Analytics('UA-881783-17')

const store = new Vuex.Store({
  state: {
    bus,
    analytics,
    volume: false,
    alwaysOnTop: false,
    timers: [
      // new Timer(bus, {type: Timer.TYPE_TOMATO, completed: true}),
    ],
    timer: null,
    autoPlay: false
  },
  mutations: {
    setCurrentTimer(state, timer) {
      state.timer = timer
    },
    addTimer(state, timer) {
      state.timers.push(timer)
    },
    addTimers(state, timers) {
      state.timers = timers
    },
    setVolume(state, value) {
      state.volume = value
      preferences.set('volume', value)
    },
    setAutoPlay(state, value) {
      state.autoPlay = value
      preferences.set('autoPlay', value)
    },
    setAlwaysOnTop(state, value) {
      state.alwaysOnTop = value
      ipcRenderer.send('always-on-top', state.alwaysOnTop)
      preferences.set('alwaysOnTop', value)
    },
    GA_screen(state, value) {
      state.analytics.event(`screen`, `${value}`, {
        evLabel: `${version}`
      })
    },
    GA_event(state, { evCategory, evAction, opt }) {
      opt = opt || {}
      state.analytics.event(evCategory, evAction, opt)
    }
  },
  getters: {
    tomatoes: (state) => {
      return state.timers
        .filter((timer) => timer.completed && timer.type === Timer.TYPE_TOMATO)
        .slice(-8)
    },
    volumeLevel: (state) => {
      return state.volume ? 0.5 : 0
    }
  },
  actions: {
    initTimer({ commit, state, getters }) {
      let type
      const totalTomatoes = getters.tomatoes.length

      // check that is not the first tomato,
      // that we are in the % 4 tomato,
      // and the current pomodoro is not a long break
      if (
        totalTomatoes !== 0 &&
        getters.tomatoes.length % 4 === 0 &&
        state.timer &&
        state.timer.type !== Timer.TYPE_LONG_BREAK
      ) {
        type = Timer.TYPE_LONG_BREAK
      } else if (state.timer && state.timer.type === Timer.TYPE_TOMATO) {
        type = Timer.TYPE_BREAK
      } else {
        type = Timer.TYPE_TOMATO
      }

      const timer = new Timer(bus, { type })

      console.log('timer', timer)
      commit('setCurrentTimer', timer)

      if (state.autoPlay) {
        state.timer.play()
      }
    },
    loadPreferences({ commit }) {
      console.log('loading preferences...')
      // volume on?
      if (typeof preferences.get('volume') !== 'undefined') {
        commit('setVolume', preferences.get('volume'))
      }

      // alwaysOnTop on?
      if (typeof preferences.get('alwaysOnTop') !== 'undefined') {
        commit('setAlwaysOnTop', preferences.get('alwaysOnTop'))
      }

      // autoPlay on?
      if (typeof preferences.get('autoPlay') !== 'undefined') {
        commit('setAutoPlay', preferences.get('autoPlay'))
      }
    }
  }
})

export default store
