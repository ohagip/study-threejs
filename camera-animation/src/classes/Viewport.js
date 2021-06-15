import EventEmitter from 'events'
import debounce from 'debounce'

/**
 * Viewport
 * @extends {EventEmitter}
 */
export default class Viewport extends EventEmitter {
  constructor() {
    super()

    /**
     * @type {number}
     */
    this.width = 0

    /**
     * @type {number}
     */
    this.height = 0

    /**
     * @type {number}
     */
    this.aspect = 0

    /**
     * @type {number}
     */
    this.devicePixelRatio =  window.devicePixelRatio || 1

    /**
     * @type {string}  '' | 'landscape' | 'portrait'
     */
    this.orientation = ''

    // resize
    this.debounceResize = debounce(this.resize.bind(this), 10)
    window.addEventListener('resize', this.debounceResize)
    this.resize()
  }

  /**
   * resize
   */
  resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.width = width
    this.height = height
    this.aspect = width / height
    this.orientation = height >= width ? 'landscape' : 'portrait'

    this.emit('resize')
  }

  /**
   * dispose
   */
  dispose() {
    window.removeEventListener('resize', this.debounceResize)
    this.debounceResize.clear()
    this.removeAllListeners()
  }
}