import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

import { lyric2model } from 'utils'

import { Editor, Footer as vFooter, Form as vForm, Help, Step, Upload } from 'components'
import APlayer from 'vue-aplayer-plugin'
import 'vue-aplayer-plugin/dist/APlayer.min.css'
Vue.use(APlayer)

@WithRender
@Component({ components: { Editor, vFooter, vForm, Help, Step, Upload } })
export default class IndexPage extends Vue {

  @Getter('aplayer/list')
  private readonly music: Array<APlayer.Music>
  @Action('aplayer/getMusics')
  private getMusics: () => void
  @Action('aplayer/getLyricAsync')
  private getLyricAsync: (id: number) => void

  private lyric: string = ''
  private model: Model = { songName: '', singerName: '', albumName: '', authorName: '' }

  private created (): void {
    this.getMusics()
  }

  @Watch('lyric')
  private lyricChange (): void {
    this.model = lyric2model(this.lyric)
  }

}
