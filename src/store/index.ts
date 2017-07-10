import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import { form, editor } from './modules'
import createLogger from 'vuex/src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: { form, editor },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
