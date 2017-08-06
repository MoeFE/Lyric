export abstract class Config {
  public static baseURL: string = 'https://api.quq.cat'
  public static apis = {
    search: '/search?keywords=',
    playlist: '/playlist/detail?id=805272969',
    playurl: '/music/url',
    lyric: '/lyric'
  }
}
