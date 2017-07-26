import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Upload.html?style=./Upload.scss'

@WithRender
@Component
export class Upload extends Vue { }
export default Upload
