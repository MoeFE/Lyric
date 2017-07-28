import { Module, GetterTree, MutationTree } from 'vuex'
import { State } from './state'
import { getters } from './getters'
import { mutations } from './mutations'

const state: State = {
  model: { songName: '', singerName: '', albumName: '', authorName: '' }
}

export class Form implements Module<State, any> {
  public readonly namespaced: boolean = true
  public readonly state: State = state
  public readonly getters: GetterTree<State, any> = getters
  public readonly mutations: MutationTree<State> = mutations
}
