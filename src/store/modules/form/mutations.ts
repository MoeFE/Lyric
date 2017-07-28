import { MutationTree } from 'vuex'
import { State } from './state'
import { UPDATE_MODEL } from './types'

export const mutations = {
  [UPDATE_MODEL]: (state: State, model: Model) => state.model = model
} as MutationTree<State>
