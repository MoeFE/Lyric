import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.css'

import { Prop } from 'vue-property-decorator'

@WithRender
@Component
export default class Hello extends Vue {
  @Prop({ type: Boolean, default: true })
  links: boolean

  @Prop({ type: Boolean, default: true })
  ecosystem: boolean

  msg = 'Welcome to Your Vue.js App'
}
