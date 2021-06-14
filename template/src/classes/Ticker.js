import EventEmitter from 'events'

/**
 * Ticker
 *  @extends {EventEmitter}
 */
export default class Ticker extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(100)

    this.tickRequestId = null

    /**
     * @type {number}
     */
    this.startTime = 0

    /**
     * @type {number}
     */
    this.currentTime = 0

    /**
     * @type {number}
     */
    this.elapsedTime = 0

    /**
     * @type {number}
     */
    this.deltaTime = 0

    // bind
    this.tick = this.tick.bind(this)
  }

  /**
   * tick
   */
  tick() {
    const newTime = Date.now()

    this.elapsedTime = newTime - this.startTime
    this.deltaTime = newTime - this.currentTime
    this.currentTime = newTime

    // if (this.deltaTime > 60) {
    //   this.deltaTime = 60
    // }

    this.emit('tick', this.deltaTime)

    this.tickRequestId = requestAnimationFrame(this.tick)
  }



  /**
   * start
   */
  start() {
    this.startTime = Date.now()
    this.currentTime = this.startTime
    this.tickRequestId = requestAnimationFrame(this.tick)
  }

  /**
   * stop
   */
  stop() {
    cancelAnimationFrame(this.tickRequestId)
  }
}