import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Editor.html?style=./Editor.scss'

import { Prop } from 'vue-property-decorator'

@WithRender
@Component
export class Editor extends Vue {

  @Prop({ type: String, required: true })
  public readonly value: string

}

export default Editor
