import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './Editor.html?style=./Editor.scss'

import { Prop, Watch } from 'vue-property-decorator'
import { LRCUtil } from 'utils'

@WithRender
@Component
export class Editor extends Vue {

  @Prop({ type: String, required: true })
  public readonly value: string
  @Prop({ type: Object, required: true, default: () => ({ singerName: '', songName: '', albumName: '', authorName: '' } as Model) })
  public readonly model: Model
  @Prop({ type: Number, required: true, default: 0 })
  public readonly currentTime: number

  private get meta (): string {
    return LRCUtil.getMeta(this.model)
  }

  private get textarea (): HTMLTextAreaElement {
    const div = this.$refs.textarea['$el'] as HTMLDivElement
    const textarea = div.firstChild as HTMLTextAreaElement
    return textarea
  }

  private lineIndex (): number {
    return this.value.substr(0, this.textarea.selectionStart).split('\n').length - 1
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
    const resetValue = (value: string) => value.replace(regex, '').trim() + '\n'
    const value: string = resetValue(this.value)
    this.$emit('input', value.trim() ? this.meta + value : '')
    const target = event && event.target as HTMLTextAreaElement
    if (target && target.tagName && target.tagName.toLowerCase() === 'textarea') {
      this.$nextTick(() => target.selectionStart = target.selectionEnd = target.value.length - 1)
    }
  }

  @Watch('currentTime')
  private updateCurrentTime (): void {
    LRCUtil.currentTime = this.currentTime
  }

  private timeTagAction (action: 'insertTimeTag' | 'replaceTimeTag' = 'insertTimeTag'): void {
    const line: number = this.lineIndex()
    const start: number = this.value.split('\n').filter((_, index) => index < line).join().length + 1
    this.$emit('input', LRCUtil[action](this.value, line))
    // 将光标移动到下一行并调整滚动条位置
    this.$nextTick(() => {
      this.textarea.selectionStart = this.textarea.selectionEnd = start + this.value.split('\n')[line].length + 1
      this.textarea.scrollTop = Number.parseInt(window.getComputedStyle(this.textarea)['line-height']) * (this.lineIndex() - 7) // 滚动条位置优化
      this.textarea.focus()
    })
  }

  private add (): void {
    this.timeTagAction('insertTimeTag')
  }
  private rp (): void {
    this.timeTagAction('replaceTimeTag')
  }
  private rm (): void {
    const line: number = this.lineIndex()
    const start: number = this.value.split('\n').filter((_, index) => index < line).join().length + 1
    this.$emit('input', LRCUtil.removeTimeTag(this.value, this.lineIndex()))
    this.$nextTick(() => {
      this.textarea.selectionStart = this.textarea.selectionEnd = start
      this.textarea.focus()
    })
  }
  private del (): void {
    this.$emit('input', LRCUtil.deleteTimeTag(this.value))
    this.$nextTick(() => {
      this.textarea.selectionStart = this.textarea.selectionEnd = this.meta.length
      this.textarea.scrollTop = 0
      this.textarea.focus()
    })
  }
  private undo (): void {
    document.execCommand('undo')
    this.$nextTick(() => this.textarea.focus())
  }
  private redo (): void {
    document.execCommand('redo')
    this.$nextTick(() => this.textarea.focus())
  }
  private preview (): void {
    this.$emit('preview')
  }

}

export default Editor
