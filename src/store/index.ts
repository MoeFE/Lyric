import Vue from 'vue'
import Vuex from 'vuex'
import { APlayer } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    aplayer: new APlayer()
  }
})
