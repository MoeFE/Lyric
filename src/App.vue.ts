import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './App.html?style=./App.css'

@WithRender
@Component
export default class App extends Vue {
}
