import { GetterTree } from 'vuex'
import { State } from './state'

const options = (state: State) => () => state
const music = (state: State) => () => state.music

export default { options, music } as GetterTree<State, any>
