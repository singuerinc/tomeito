import Vue from 'vue'
import Vuex from 'vuex'
import Timer from './timer'
import { isSameDay } from 'date-fns'
import * as preferences from 'store'

Vue.use(Vuex)

const bus = new Vue()

const store = new Vuex.Store({
  state: {
    bus,
    volume: true,
    timers: [],
    timer: null,
    auto: false
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
    }
  },
  getters: {
    tomatoes: state => {
      return state.timers.filter(timer => (timer.completed && timer.type === Timer.TYPE_TOMATO))
    }
  },
  actions: {
    loadPreferences ({commit}) {
      console.log('loading preferences...')
      // volume on?
      if (typeof preferences.get('volume') !== 'undefined') {
        commit('setVolume', preferences.get('volume'))
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

      commit('setCurrentTimer', new Timer({bus, type: Timer.TYPE_TOMATO}))
    }
  }
})

export default store
