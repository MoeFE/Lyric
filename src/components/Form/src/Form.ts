import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Form.html'
import './Form.scss'

import { Watch } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { UPDATE_MODEL } from 'store/modules/form/types'

@WithRender
@Component
export class Form extends Vue {

  /** 表单数据 */
  private readonly model: Model = {
    songName: null, // 歌曲名
    singerName: null, // 歌手名
    albumName: null, // 专辑名
    authorName: null // 编辑人
  }

  /** 验证规则 */
  private readonly rules = {
    songName: { required: true, message: '请输入歌曲名称' },
    singerName: { required: true, message: '请输入歌手名称，多个歌手之间用 / 或 & 隔开' }
  }

  @Mutation(UPDATE_MODEL, { namespace: 'form' })
  private updateModel: (model: Model) => void

  /** 搜索事件 */
  private searchHandler (queryString: string, callback: (data: any[]) => void): void {
    console.log('queryString: ', queryString)
    console.log(callback)
  }

  @Watch('model', { deep: true })
  private modelChange (): void {
    this.updateModel(this.model)
  }

}

export default Form
