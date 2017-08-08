export abstract class LRCUtil {

  public static currentTime: number = 0

  private static regex = {
    songName: /\[ti:(.*)\]/,
    singerName: /\[ar:(.*)\]/,
    albumName: /\[al:(.*)\]/,
    authorName: /\[by:(.*)\]/
  }

  public static insertTimeTag (lrc: string, row: number): string {
    const lines: Array<string> = lrc.split('\n')
    lines[row] = LRCUtil.displayCurrentTime + lines[row]
    return lines.join('\n').trim()
  }
  public static removeTimeTag (lrc: string, row: number): string {
    const lines: Array<string> = lrc.split('\n')
    lines[row] = lines[row].replace(/\[(\d+):(\d+).(\d+)]/, '').trim()
    return lines.join('\n')
  }
  public static replaceTimeTag (lrc: string, row: number): string {
    return LRCUtil.insertTimeTag(LRCUtil.removeTimeTag(lrc, row), row)
  }
  public static deleteTimeTag (lrc: string): string {
    return lrc.replace(/\[(\d+):(\d+).(\d+)]/g, '').split('\n').map(line => line.trim()).join('\n')
  }
  public static isValid (lrc: string): boolean {
    return Boolean(lrc.match(/\[(\d+):(\d+).(\d+)]/g))
  }
  public static lyric2model (lyric: string): Model {
    const model = { songName: '', singerName: '', albumName: '', authorName: '' }
    Object.keys(LRCUtil.regex).forEach(key => {
      const match = lyric.match(LRCUtil.regex[key])
      model[key] = match ? match[1] : ''
    })
    return model as Model
  }
  public static getPureLyric (lrc: string): string {
    lrc = LRCUtil.deleteTimeTag(lrc)
    Object.keys(LRCUtil.regex).forEach(key => {
      lrc = lrc.replace(LRCUtil.regex[key], '')
    })
    return lrc
  }
  public static getMeta (model: Model): string {
    const { songName, singerName, albumName, authorName } = model
    return `[ti:${songName}]\n[ar:${singerName}]\n[al:${albumName}]\n[by:${authorName}]\n\n`
  }

  private static get displayCurrentTime (): string {
    const minutes = Number.parseInt((LRCUtil.currentTime / 60).toString()).toString().padLeft(2, '0')
    const seconds = Number.parseInt((LRCUtil.currentTime % 60).toString()).toString().padLeft(2, '0')
    const millisconds = Number.parseInt((LRCUtil.currentTime % 60 % (Number.parseInt(seconds) || 1) * 100).toString()).toString().padLeft(2, '0')
    return `[${minutes}:${seconds}.${millisconds}] `
  }

}

export default LRCUtil
