import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Editor.html?style=./Editor.scss'

import { Prop, Watch } from 'vue-property-decorator'

@WithRender
@Component
export class Editor extends Vue {

  @Prop({ type: String, required: true })
  public readonly value: string
  @Prop({ type: Object, required: true, default: () => ({ singerName: '', songName: '', albumName: '', authorName: '' } as Model) })
  public readonly model: Model

  private get meta (): string {
    const { songName, singerName, albumName, authorName } = this.model
    return `[ti:${songName}]\n[ar:${singerName}]\n[al:${albumName}]\n[by:${authorName}]\n\n`
  }

  private updateValue (value: string): void {
    const regex: RegExp = /\[ti:.*\]|\[ar:.*\]|\[al:.*\]|\[by:.*\]/g
    const match: Array<string> = value.match(regex)
    const hasMeta: Boolean = match && match.length === 4
    this.$emit('input', hasMeta ? value : this.meta + value)
  }

  @Watch('model', { deep: true })
  private modelChange (): void {
    const regex: RegExp = /\[ti:.*\]|\[ar:.*\]|\[al:.*\]|\[by:.*\]/g
    const resetValue = (value: string) => value.replace(regex, '').trim()
    const value: string = resetValue(this.value)
    this.$emit('input', value ? this.meta + value : '')
  }

  private add (): void {
    console.log('add')
  }
  private rp (): void {
    console.log('rp')
  }
  private rm (): void {
    console.log('rm')
  }
  private del (): void {
    console.log('del')
  }
  private undo (): void {
    console.log('undo')
  }
  private redo (): void {
    console.log('redo')
  }
  private preview (): void {
    console.log('preview')
  }

}

export default Editor
