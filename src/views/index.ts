import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

import { LRCUtil, Thread } from 'utils'
import * as Clipboard from 'clipboard'
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

  private $notify: any
  private $confirm: any
  private $message: any
  private $loading: any
  private loading: any = null
  private aplayer: any = null
  private showlrc: boolean = true
  private active: number = 0
  private mp3Url: string = null
  private lyric: string = ''
  private model: Model = { songName: '', singerName: '', albumName: '', authorName: '' }

  private get currentTime (): number {
    return this.aplayer ? this.aplayer.media.currentTime : 0
  }

  private beforeCreate (): void {
    window['NProgress'].start()
  }

  private async mounted (): Promise<void> {
    this.aplayer = this.$refs.aplayer
    await this.getMusics()
    this.aplayer.play(0)
  }

  @Watch('mp3Url')
  private mp3UrlChange (): void {
    this.active = this.mp3Url === this.aplayer.currentMusic.url ? 1 : 0
    this.lyricChange()
  }

  @Watch('lyric')
  private lyricChange (): void {
    if (this.lyric.trim()) this.model = LRCUtil.lyric2model(this.lyric)
    if (this.mp3Url === this.aplayer.currentMusic.url) {
      this.active = LRCUtil.isValid(this.lyric) ? 2 : 1
    } else this.active = 0
  }

  @Watch('active')
  private activeChange (): void {
    if (this.active === 1) this.$message('音频文件已载入')
    else if (this.active === 3) {
      this.showlrc = true
      this.aplayer.togglePlayMode('single')
    } else {
      this.aplayer.togglePlayMode('circulation')
    }
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
      this.model.albumName = item.album.name || ''
      this.lyric = LRCUtil.getMeta(this.model) + LRCUtil.getPureLyric(this.lyric)
      const { data } = item.id ? await NeteaseCloudMusicApi.getMusicURL(item.id) : { data: { success: true } }
      if (data.success) {
        const music = {
          id: item.id,
          title: this.model.songName,
          author: this.model.singerName,
          pic: item.album.picUrl,
          url: item.id ? data['data'][0].url : item.mp3Url
        }
        this.mp3Url = music.url
        const index = this.music.findIndex(x => x.id === item.id)
        if (index < 0) this.music.push(music)
        this.aplayer.play(index < 0 ? this.music.length - 1 : index)
        this.aplayer.play()
      }
    }
  }

  private async loadedmetadata (): Promise<void> {
    window['NProgress'].done()
    this.mp3UrlChange()
    this.showlrc = this.active === 0
    if (this.aplayer.currentMusic.lrc && this.aplayer.currentMusic.lrc !== 'loading') return
    await Thread.sleep(500)
    const { data } = await NeteaseCloudMusicApi.getLyric(this.aplayer.currentMusic.id)
    const lrc = data.nolyric || data.uncollected ? '' : data.lrc.lyric
    if (data.success && this.showlrc) {
      this.aplayer.setMusic({ ...this.aplayer.currentMusic, lrc })
    } else {
      this.lyric = LRCUtil.getMeta(this.model) + LRCUtil.getPureLyric(lrc)
    }
  }

  private async errorHandler (): Promise<void> {
    this.$message({ type: 'error', message: '加载音频文件失败' })
    if (this.aplayer.playIndex < 0) return
    this.aplayer.pause()
    if (this.music.length > 0) {
      await this.getMusics(new Date().getTime())
      await Thread.sleep()
      this.aplayer.play(this.aplayer.playIndex)
      this.aplayer.play()
      return
    }
  }

  private previewHandler (): void {
    if (this.active === 2) {
      this.active = 3
      this.aplayer.setMusic({ ...this.aplayer.currentMusic, lrc: this.lyric })
    } else {
      const isDesktop = window['device'].desktop()
      this.$message({
        type: 'warning',
        message: isDesktop ? '音乐文件未载入，可通过歌曲名称搜索网易云音乐曲库，使用网络地址，或本地上传的方式载入。' : '请先载入音乐文件',
        duration: isDesktop ? 5e3 : 3e3,
        showClose: isDesktop
      })
    }
  }

  private uploadLoadstartHandler (): void {
    this.loading = this.$loading({ fullscreen: true })
  }

  private uploadLoadendHandler (file: File): void {
    if (!file) return
    this.loading.close()

    // 判断文件类型
    if (!file.type.startsWith('audio/')) {
      this.$message({ type: 'error', message: '文件格式不支持，请上传音频文件' })
      return
    }
    // 判断 size
    if (file.size <= 0) {
      this.$message({ type: 'error', message: '读取文件大小失败' })
      return
    }

    // 文件名（歌手 - 歌名.扩展名）
    const result = /(.+)\s*-\s*(.+)(\..+)/.exec(file.name)
    // 模拟触发 select 事件载入数据
    this.selectHandler({
      name: result[2] || file.name.substr(0, file.name.lastIndexOf('.')) || '未知歌曲',
      artists: [{ name: result[1] || '未知歌手' }],
      mp3Url: URL.createObjectURL(file), // 使用 objectURL, Base64太大导致 localStorage 存储不下
      album: {}
    })
  }

  private loadNetworkMedia (): void {
    const target = event.target as HTMLInputElement
    const url = target.value
    // 如果URL为空或未改变则不加载
    if (url.trim().length <= 0 || url === this.mp3Url) return
    // 模拟触发 select 事件载入数据
    this.selectHandler({
      name: '网络歌曲',
      artists: [{ name: '网络歌手' }],
      mp3Url: url,
      album: {}
    })
  }

  private async downloadHandler (): Promise<void> {
    if (this.active === 3) {
      const text = '点击下载后会将工作区重置到初始状态以便编辑新歌词，请务必保存到本地（为了避免误操作歌词会复制到剪切板）'
      const action = await this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnPressEscape: true
      })

      // 剪切板操作
      if (!Clipboard['isSupported']()) {
        this.$message({ type: 'warning', message: '您的浏览器不支持复制操作，请使用现代浏览器' })
      } else {
        const clipboard = new Clipboard('.el-message-box .el-button--primary', { text: () => this.lyric })
        clipboard.on('success', () => {
          this.$notify({
            type: 'success',
            message: '已成功将歌词复制到剪切板',
            onClose: async () => {
              Object.keys(this.model).forEach(key => this.model[key] = '')
              this.lyric = ''
              this.mp3Url = ''
              this.active = 0
              await this.getMusics()
              await Thread.sleep()
              this.aplayer.play(0)
              this.$nextTick(() => {
                this.$refs.form['$refs'].form['resetFields']()
                this.lyric = ''
              })
            }
          })
          clipboard.destroy()
        })
        clipboard.on('error', (evt) => {
          console.log(evt)
          this.$message({ type: 'error', message: '复制时出现错误，请使用现代浏览器' })
          clipboard.destroy()
        })
      }

      if (action !== 'confirm') return // 取消操作
      // 保存歌词到文件
      window['saveAs'](
        new Blob([this.lyric], { type: 'text/plain' }),
        `${this.model.singerName} - ${this.model.songName}.lrc`
      )
    } else this.$message({ type: 'warning', message: '请先编辑好歌词并预览过之后再下载哦！' })
  }

}
