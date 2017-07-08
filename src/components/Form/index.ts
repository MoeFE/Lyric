import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Prop } from 'vue-property-decorator'
import { Editor } from 'components/Editor'

@WithRender
@Component({ components: { Editor } })
export class VForm extends Vue {
  // 表单数据
  model = {
    songName: null, // 歌曲名
    singerName: null // 歌手名
  }
  // 验证规则
  rules = {
    songName: { required: true, message: '请输入歌曲名称' },
    singerName: { required: true, message: '请输入歌手名称，多个歌手之间用 / 或 & 隔开' }
  }
}
