import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

import { LRCUtil, Thread } from 'utils'
import * as NeteaseCloudMusicApi from 'api/NeteaseCloudMusicApi'

import { Editor, Footer as vFooter, Form as vForm, Help, Step, Upload } from 'components'
import APlayer from 'vue-aplayer-plugin'
import 'vue-aplayer-plugin/dist/APlayer.min.css'
Vue.use(APlayer)

Vue.component('autocomplete-singer-name', {
  functional: true,
  render: function (h, ctx) {
    const item = ctx.props.item
    return h('li', ctx.data, [
      h('div', { attrs: { class: 'songName' } }, [item.name]),
      h('span', { attrs: { class: 'singerName' } }, [item.artists.map(x => x.name).join(' / ')])
    ])
  },
  props: {
    item: { type: Object, required: true }
  }
})

@WithRender
@Component({ components: { Editor, vFooter, vForm, Help, Step, Upload } })
export default class IndexPage extends Vue {

  @Getter('aplayer/list')
  private readonly music: Array<APlayer.Music>
  @Action('aplayer/getMusics')
  private getMusics: (timestamp?: number) => void
  @Action('aplayer/getLyricAsync')
  private getLyricAsync: (id: number) => void

  private aplayer = null
  private showlrc: boolean = true
  private active: number = 0
  private mp3Url: string = null
  private lyric: string = ''
  private model: Model = { songName: '', singerName: '', albumName: '', authorName: '' }

  private get currentTime (): number {
    return this.aplayer ? this.aplayer.media.currentTime : 0
  }

  private created (): void {
    this.getMusics()
    this.lyric = `
    [ti:无归（Cover 叶里）]
    [ar:玄觞]
    [al:东方玄幻小说《完美世界》主题曲]
    [by:评戏]

    作曲 : mading
    作词 : 天谣、繁烟
    无归
    --东方玄幻小说《完美世界》主题曲
    原著/题词：辰东
    策划：辰迷社
    文案：繁烟
    作词：天谣、繁烟
    作曲/编曲/后期：mading
    填词修改/演唱/和声：叶里
    海报：色家仙仙
    出品：饺子雨原创音乐
    翻唱：玄觞

    血花飘 青山遇绝壁
    星火燎 离人依依
    经年不知情
    往事随风去
    树影乱 半世流离

    采桑归 夕露沾我衣
    不知他 可经风雨
    捣衣长河堤
    年华随水去
    惜别一展鲲鹏意

    醉梦天下
    动乱金戈铁马
    这天下可是你家

    乱世辉煌
    生死两茫茫
    这辉煌可叫人断肠

    乱世殇 折了几人腰
    争天命 战火滔滔
    剑动情飘渺
    罪血比天高
    曲在弹 谁的寂寥

    天涯路 此去复迢迢
    望不断 映乱眉梢
    岁月又涟漪
    相思无人提
    灯影残 空留叹息

    醉梦天下
    动乱金戈铁马
    这天下可是你家

    乱世辉煌
    生死两茫茫
    这辉煌可叫人断肠

    弹指间 流年不过刹那
    浮生乱 他征战天下
    风云虽动 英雄不白发

    轮回间 又是一年春夏
    挥手中 度多年牵挂
    若邵华逝 怎能等到他

    醉梦天下
    动乱金戈铁马
    这天下何处是家

    乱世辉煌
    生死两茫茫
    这辉煌敢叫人断肠

    春归秋去
    火桑已漫天际
    不知何时是归期

    灵心如玉
    守一生无惧
    待君归携手红尘去
    待火桑落后我亦归去
    `.split('\n').map(x => x.trim()).join('\n')
  }

  private mounted (): void {
    this.aplayer = this.$refs.aplayer
  }

  @Watch('mp3Url')
  private mp3UrlChange (): void {
    this.active = this.mp3Url ? 1 : 0
    this.lyricChange()
  }

  @Watch('lyric')
  private lyricChange (): void {
    this.model = LRCUtil.lyric2model(this.lyric)
    if (!this.mp3Url) this.active = 0
    else this.active = LRCUtil.isValid(this.lyric) ? 2 : 1
  }

  private async searchSuggest (qs: string, cb: (data: Array<any>) => void): Promise<void> {
    const empty = this.model.songName && this.model.singerName
    const currentElement = (window.event || { currentTarget: null }).currentTarget // if null
    const currentValue = (currentElement || { value: null }).value // if null
    let suggLength = document.querySelectorAll('.el-autocomplete__suggestions').length
    if (suggLength === 1 && qs === currentValue) suggLength = 0 // 禁止弹出多个搜索建议
    if (!qs || (empty && suggLength > 0)) { // 禁止弹出多个搜索建议
      cb([]) // 搜索关键字为空
      return
    }
    // 如果歌曲名和歌手名都输入了，则搜索组合
    this.model.songName && this.model.singerName && (qs = `${this.model.songName.trim()} - ${this.model.singerName.trim()}`)
    const { data } = await NeteaseCloudMusicApi.searchKeyword(qs)
    cb(data.success ? data.result.songs : [])
  }

  private async selectHandler (item): Promise<void> {
    if (item) {
      this.model.songName = item.name
      this.model.singerName = item.artists.map(x => x.name).join(' / ')
      const { data } = await NeteaseCloudMusicApi.getMusicURL(item.id)
      if (data.success) {
        const music = {
          id: item.id,
          title: this.model.songName,
          author: this.model.singerName,
          pic: item.album.picUrl,
          url: data['data'][0].url
        }
        this.mp3Url = music.url
        this.showlrc = false
        if (this.music.findIndex(x => x.id === item.id) < 0) this.music.push(music)
        this.aplayer.play(this.music.length - 1)
        this.aplayer.play()
      }
    }
  }

  private async playHandler (): Promise<void> {
    this.showlrc = true
    if (this.aplayer.currentMusic.lrc && this.aplayer.currentMusic.lrc !== 'loading') return
    await Thread.sleep(500)
    const { data } = await NeteaseCloudMusicApi.getLyric(this.aplayer.currentMusic.id)
    if (data.success) {
      this.aplayer.setMusic({ ...this.aplayer.currentMusic, lrc: data.nolyric || data.uncollected ? null : data.lrc.lyric })
    }
  }

  private async errorHandler (): Promise<void> {
    debugger
    if (this.aplayer.playIndex < 0) return
    this.aplayer.pause()
    debugger
    if (this.music.length > 0) {
      await this.getMusics(new Date().getTime())
      this.aplayer.play(this.aplayer.playIndex)
      this.aplayer.play()
      return
    }
  }

}
