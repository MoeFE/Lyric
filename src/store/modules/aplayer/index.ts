import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'

import { State } from './state'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const state: State = {
  list: []
}

export class APlayer implements Module<State, any> {
  public readonly namespaced: boolean = true
  public readonly state: State = state
  public readonly actions: ActionTree<State, any> = actions
  public readonly getters: GetterTree<State, any> = getters
  public readonly mutations: MutationTree<State> = mutations
}
