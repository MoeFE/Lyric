import Vue from 'vue'
import Component from 'vue-class-component'
import WithRender from './index.html?style=./index.scss'

import { Prop } from 'vue-property-decorator'
import * as APlayer from 'aplayer'

@WithRender
@Component
export class Player extends Vue {
  mounted () {
    // tslint:disable-next-line:no-unused-expression
    new APlayer({
      element: this.$refs.aplayer,
      listmaxheight: '115px',
      music: {
        title: 'あっちゅ～ま青春!',
        author: '七森中☆ごらく部',
        url: 'http://devtest.qiniudn.com/あっちゅ～ま青春!.mp3',
        pic: 'http://devtest.qiniudn.com/あっちゅ～ま青春!.jpg'
      }
    })
  }
}
