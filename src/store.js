import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const bus = new Vue()

const store = new Vuex.Store({
  state: {
    bus,
    tomatoes: [],
    tomato: null
  },
  mutations: {}
})

export default store
