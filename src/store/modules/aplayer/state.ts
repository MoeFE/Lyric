export class State implements IAPOption {
  /** player element */
  element?: string | HTMLElement
  /** narrow style */
  narrow?: boolean = false
  /** autoplay song(s), not supported by mobile browsers */
  autoplay?: boolean = false
  /** show lrc, can be 0, 1, 2 */
  showlrc?: 0 | 1 | 2 = 0
  /** pause other players when this player playing */
  mutex?: boolean = true
  /** theme color, default: #b7daff */
  theme?: string = '#b7daff'
  /** play mode, can be `random` `single` `circulation`(loop) `order`(no loop), default: `circulation` */
  mode?: PlayMode = 'circulation'
  /** the way to load music, can be 'none' 'metadata' 'auto', default: 'auto' */
  preload?: Preload = 'metadata'
  /** max height of play list */
  listmaxheight?: string = '115px'
  /** music info */
  music: IAPMusic | IAPMusic[] = []
}
