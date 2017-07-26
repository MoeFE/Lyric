import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Editor.html?style=./Editor.scss'

@WithRender
@Component
export class Editor extends Vue { }
export default Editor
