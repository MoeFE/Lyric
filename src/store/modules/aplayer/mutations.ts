import { MutationTree } from 'vuex'
import { State } from './state'
import * as types from './mutation-types'
const { ADD_MUSICS } = types

const mutations: MutationTree<State> = {
  [ADD_MUSICS]: (state: State, { musics }) => {
    state.music = musics
  }
}

export default { ...mutations }
