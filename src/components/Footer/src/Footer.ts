import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Footer.html?style=./Footer.scss'

@WithRender
@Component
export class Footer extends Vue { }
export default Footer
