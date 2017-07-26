import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Step.html?style=./Step.scss'

@WithRender
@Component
export class Step extends Vue { }
export default Step
