import { GetterTree } from 'vuex'
import { State } from './state'

export const model = (state: State) => state.model
export const meta = (state: State) => (`
[ti:${state.model.songName}]
[al:${state.model.singerName}]
[ar:${state.model.albumName}]
[by:${state.model.authorName}]
[t_time:(00:00)]`.trim() + '\n\n')

export const getters = { model, meta } as GetterTree<State, any>
