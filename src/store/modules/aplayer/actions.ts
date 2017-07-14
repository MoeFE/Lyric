import { favorite } from 'api/NeteaseCloudMusicApi'
import { ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import * as types from './mutation-types'
const { ADD_MUSICS } = types

/** 获取我收藏的歌单歌曲列表 */
async function favorites (state: ActionContext<State, any>) {
  const response = await favorite()
  if (response.data.success) {
    const musics: Array<IAPMusic> = []
    const tracks = response.data.playlist.tracks as Array<any>
    tracks.forEach(item => {
      musics.push({
        title: item.name,
        author: item.ar.map(x => x.name).join('／'),
        pic: item.al.picUrl,
        url: ''
      })
    })
    state.commit({ type: ADD_MUSICS, musics })
  }
}

export default { favorites } as ActionTree<State, any>
