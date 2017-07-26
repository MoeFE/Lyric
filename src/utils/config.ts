export abstract class Config {
  public static baseURL: string = 'https://api.quq.cat'
  public static apis = {
    search: '/search?keywords=Hanser',
    playlist: '/user/playlist?uid=273292534&limit=1',
    collection: '/playlist/detail?id=805272969',
    playurl: '/music/url',
    lyric: '/lyric'
  }
}
