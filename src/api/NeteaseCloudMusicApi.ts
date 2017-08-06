import { request } from 'utils'
import { Config } from 'utils'
const { search, playlist, playurl, lyric } = Config.apis

export async function searchKeyword (kw: string) {
  return await request(search + kw)
}

export async function getFavorites () {
  return await request(playlist)
}

export async function getMusicURL (id: number, timestamp?: number) {
  return await request(playurl, { id, timestamp })
}

export async function getMusicURLs (id: number[], timestamp?: number) {
  return await request(playurl, { id: id.join(), timestamp })
}

export async function getLyric (id: number) {
  return await request(lyric, { id })
}
