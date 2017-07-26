import { MutationTree } from 'vuex'
import { State } from './state'
import { ADD_MUSICS, SET_MUSIC } from './types'

export const mutations = {
  [ADD_MUSICS]: (state: State, musics: Array<APlayer.Music>) => state.list = musics
} as MutationTree<State>
