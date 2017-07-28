import Vue from 'vue'
import Vuex from 'vuex'
import { APlayer, Form } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    aplayer: new APlayer(),
    form: new Form()
  }
})
