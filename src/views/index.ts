import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Prop } from 'vue-property-decorator'
import { Help } from 'components/Help'
import { Step } from 'components/Step'
import { VForm } from 'components/Form'
import { Upload } from 'components/Upload'
import { VFooter } from 'components/Footer'
import { Player as APlayer } from 'components/Player'

@WithRender
@Component({ components: { Help, Step, VForm, Upload, APlayer, VFooter } })
export default class Main extends Vue { }
