import Vue from 'vue'
import Vuex from 'vuex'
import Timer from './timer'

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
    },
    setVolume (state, value) {
      state.volume = value
    },
    setVolumeOn (state) {
      state.volume = true
    },
    setVolumeOff (state) {
      state.volume = false
    }
  },
  getters: {
    tomatoes: state => {
      return state.timers.filter(timer => (timer.completed && timer.type === Timer.TYPE_TOMATO))
    }
  }
})

export default store
