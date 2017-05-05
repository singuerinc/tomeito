import Vue from 'vue'
import Vuex from 'vuex'
import Timer from './timer'
import { isSameDay } from 'date-fns'
import * as preferences from 'store'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

const bus = new Vue()

const store = new Vuex.Store({
  state: {
    bus,
    volume: false,
    alwaysOnTop: false,
    timers: [],
    timer: null,
    autoPlay: false
  },
  mutations: {
    setCurrentTimer (state, timer) {
      state.timer = timer
    },
    addTimer (state, timer) {
      state.timers.push(timer)
      preferences.set('timers', {
        date: new Date().toDateString(),
        timers: state.timers
      })
    },
    addTimers (state, timers) {
      state.timers = timers
    },
    setVolume (state, value) {
      state.volume = value
      preferences.set('volume', value)
    },
    setAutoPlay (state, value) {
      state.autoPlay = value
      preferences.set('autoPlay', value)
    },
    setAlwaysOnTop (state, value) {
      state.alwaysOnTop = value
      ipcRenderer.send('always-on-top', state.alwaysOnTop)
      preferences.set('alwaysOnTop', value)
    }
  },
  getters: {
    tomatoes: state => {
      return state.timers.filter(timer => (timer.completed && timer.type === Timer.TYPE_TOMATO))
    },
    volumeLevel: state => {
      return state.volume ? 0.5 : 0
    }
  },
  actions: {
    initTimer ({commit, state}) {
      let type

      if (state.timer && state.timer.type === Timer.TYPE_TOMATO) {
        type = Timer.TYPE_BREAK
      } else {
        type = Timer.TYPE_TOMATO
      }

      commit('setCurrentTimer', new Timer({bus, type}))

      if (state.autoPlay) {
        state.timer.play()
      }
    },
    loadPreferences ({commit}) {
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

      // today's timers
      if (typeof preferences.get('timers') !== 'undefined') {
        const timers = preferences.get('timers')
        const timersDate = Date.parse(timers.date)

        if (isSameDay(timersDate, new Date())) {
          commit('addTimers', timers.timers)
        } else {
          preferences.remove('timers')
        }
      }
    }
  }
})

export default store
