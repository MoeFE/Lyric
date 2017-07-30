import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Form.html'
import './Form.scss'

import { Prop } from 'vue-property-decorator'

@WithRender
@Component
export class Form extends Vue {

  /** 表单数据 */
  @Prop({ type: Object, required: false, default: () => ({ songName: '', singerName: '', albumName: '', authorName: '' } as Model) })
  public readonly model: Model

  /** 验证规则 */
  private readonly rules = {
    songName: { required: true, message: '请输入歌曲名称' },
    singerName: { required: true, message: '请输入歌手名称，多个歌手之间用 / 或 & 隔开' }
  }

}

export default Form
