import Vue from 'vue'
import Vuex from 'vuex'
import { APlayer } from './modules'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    aplayer: new APlayer()
  },
  strict: debug
})
