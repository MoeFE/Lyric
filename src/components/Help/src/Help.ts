import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Help.html?style=./Help.scss'

@WithRender
@Component
export class Help extends Vue { }
export default Help
