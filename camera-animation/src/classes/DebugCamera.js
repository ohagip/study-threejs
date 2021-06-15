import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * DebugCamera
 */
export default class DebugCamera {
  constructor({ app }) {
    this.app = app

    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)

    this.instance = new THREE.PerspectiveCamera(75, this.app.viewPort.aspect, 1, 1000)
    this.instance.position.y = 20
    this.instance.position.z = 40
    this.app.scene.add(this.instance)

    this.controls = new OrbitControls(this.instance, this.app.renderer.domElement)
    this.controls.enabled = false

    this.app.viewPort.on('resize', this.resize)
    this.app.ticker.on('tick', this.update)
    this.app.on('debugMode', this.update)

    this.resize()
    this.debugMode(this.app.props.debugMode)
  }

  /**
   * dispose
   */
  dispose() {
    this.app.viewPort.off('resize', this.resize)
    this.app.scene.remove(this.instance)
    this.app = null
  }

  /**
   * resize
   */
  resize() {
    this.instance.aspect = this.app.viewPort.aspect
    this.instance.updateProjectionMatrix()
  }

  /**
   * update
   */
  update() {
    this.controls.update()
  }

  /**
   * debugMode
   * @param {boolean} enabled
   */
  debugMode(enabled) {
    if (enabled) {
      this.enableDebug()
    } else {
      this.disableDebug()
    }
  }

  /**
   * enableDebug
   */
  enableDebug() {
    this.controls.enabled = true
  }

  /**
   * disableDebug
   */
  disableDebug() {
    this.controls.enabled = false
  }
}