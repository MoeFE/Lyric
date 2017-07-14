import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'
import * as APlayer from 'aplayer'

import { State } from 'store/modules/aplayer/state'
import { Watch } from 'vue-property-decorator'
import { Getter, Action, namespace } from 'vuex-class'
const ModuleGetter = namespace('aplayer', Getter)
const ModuleAction = namespace('aplayer', Action)

@WithRender
@Component
export class Player extends Vue {

  /** APlayer 播放器选项 */
  @ModuleGetter('options') options: () => State
  /** [Action] 获取收藏歌单 */
  @ModuleAction('favorites') favAction: () => void

  /** APlayer 播放器实例 */
  private aplayer = null

  created () {
    this.$store.watch(this.options, options => {
      if (this.aplayer) this.aplayer.destroy()
      this.aplayer = new APlayer({ ...options, element: this.$refs.aplayer })
      this.aplayer.element.querySelector('.aplayer-icon-menu').click()
      // 注册事件
      this.aplayer.on('play', this.onplay)
      this.aplayer.on('pause', this.onpause)
      this.aplayer.on('canplay', this.oncanplay)
      this.aplayer.on('playing', this.onplaying)
      this.aplayer.on('ended', this.onended)
      this.aplayer.on('error', this.onerror)
    }, { deep: true })
    setTimeout(() => this.favAction(), 1000)
  }

  // tslint:disable:no-empty
  onplay () {}
  onpause () {}
  oncanplay () {}
  onplaying () {}
  onended () {}
  onerror () {}
  // tslint:enable:no-empty

}
