import { Module } from 'vuex'
import { State } from './state'
import Mutations from './mutations'
import Actions from './actions'
import Getters from './getters'

export class APlayer implements Module<State, any> {

  namespaced: boolean = true

  state: State
  mutations = Mutations
  actions = Actions
  getters = Getters

  constructor () {
    this.state = new State()
  }

}
