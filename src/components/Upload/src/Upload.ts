import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Upload.html?style=./Upload.scss'

@WithRender
@Component
export class Upload extends Vue {
  private changeHandler (): void {
    const target = event.target as HTMLInputElement
    const file = target.files[0]
    const reader = new FileReader()
    target.value = null
    reader.onloadend = () => {
      this.$emit('loadend', file, reader, target)
    }
    const events = ['abort', 'error', 'loadend', 'loadstart', 'progress']
    events.forEach(evt => reader.addEventListener(evt, () => this.$emit(evt)))
    reader.readAsDataURL(file)
  }
}
export default Upload
