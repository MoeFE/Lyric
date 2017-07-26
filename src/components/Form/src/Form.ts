import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Form.html'
import './Form.scss'

@WithRender
@Component
export class Form extends Vue {

  /** 表单数据 */
  private readonly model = {
    songName: null, // 歌曲名
    singerName: null // 歌手名
  }

  /** 验证规则 */
  private readonly rules = {
    songName: { required: true, message: '请输入歌曲名称' },
    singerName: { required: true, message: '请输入歌手名称，多个歌手之间用 / 或 & 隔开' }
  }

}

export default Form
