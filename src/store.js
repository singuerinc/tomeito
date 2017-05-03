import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const bus = new Vue()

const store = new Vuex.Store({
  state: {
    bus,
    volume: true,
    tomatoes: [],
    timer: null,
    auto: false
  },
  mutations: {
    setVolumeOn (state) {
      state.volume = true
    },
    setVolumeOff (state) {
      state.volume = false
    }
  }
})

export default store
