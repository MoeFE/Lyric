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
    reader.onload = () => {
      this.$emit('upload', file, reader, target)
    }
    reader.readAsDataURL(file)
  }
}
export default Upload
