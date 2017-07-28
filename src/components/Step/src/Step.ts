import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Step.html?style=./Step.scss'

import { Prop } from 'vue-property-decorator'

@WithRender
@Component
export class Step extends Vue {

  @Prop({ type: Number, default: 0, required: false })
  private active: number

}
export default Step
