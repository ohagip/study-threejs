// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import gsap from 'gsap'

/**
 * Debug
 */
export default class Debug {
  constructor({ ticker }) {
    this.ticker = ticker

    this.setupStats()
    this.setupPane()

    // bind
    this.update = this.update.bind(this)

    this.ticker.on('tick', this.update)
    this.update()
  }

  /**
   * setupStats
   */
  setupStats() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    this.$stats = this.stats.dom
    gsap.set(this.$stats, { left: '16px' })
    document.body.appendChild(this.$stats)
  }

  /**
   * setupPane
   */
  setupPane() {
    this.pane = new Pane()
    // this.$pane = this.pane.element
  }

  /**
   * update
   */
  update() {
    this.stats.update()
  }

  /**
   * dispose
   */
  dispose() {
    this.ticker.off('tick', this.update)
    document.body.removeChild(this.$stats)
    this.stats = null
    this.pane.dispose()
    this.pane = null
  }
}