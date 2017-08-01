export function lyric2model (lyric: string): Model {

  const regex = {
    songName: /\[ti:(.*)\]/,
    singerName: /\[ar:(.*)\]/,
    albumName: /\[al:(.*)\]/,
    authorName: /\[by:(.*)\]/
  }

  const model = {
    songName: '',
    singerName: '',
    albumName: '',
    authorName: ''
  }

  Object.keys(regex).forEach(key => {
    const match = lyric.match(regex[key])
    model[key] = match ? match[1] : ''
  })

  return model as Model

}
