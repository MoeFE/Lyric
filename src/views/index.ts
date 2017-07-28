import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Getter, Action } from 'vuex-class'

import { Editor, Footer as vFooter, Form as vForm, Help, Step, Upload } from 'components'
import APlayer from 'vue-aplayer-plugin'
import 'vue-aplayer-plugin/dist/APlayer.min.css'
Vue.use(APlayer)

@WithRender
@Component({ components: { Editor, vFooter, vForm, Help, Step, Upload } })
export default class IndexPage extends Vue {

  private lrc: string = ''

  @Getter('aplayer/list')
  private readonly music: Array<APlayer.Music>
  @Getter('form/meta')
  private readonly meta: string
  @Action('aplayer/getMusics')
  private getMusics: () => void
  @Action('aplayer/getLyricAsync')
  private getLyricAsync: (id: number) => void

  private get lyric (): string {
    return this.meta
  }

  private set lyric (value) {
    this.lrc = value
  }

  private async created (): Promise<void> {
    this.getMusics()
  }

}
