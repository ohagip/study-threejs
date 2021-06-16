import * as THREE from 'three'
import normalizeWheel from 'normalize-wheel'
import { clamp, lerp } from '../modules/utils/math'

/**
 * Camera
 */
export default class Camera {
  constructor({ app }) {
    this.app = app

    this.props = {
      progress: 0,
      currentScrollSpeed: 0,
      targetScrollSpeed: 0,
      scrollSpeedLimit: 100,
      scrollSpeedEase: 0.4,
      scrollSpeedFriction: 10,
      scrollSpeedToTimeRatio: 1 / 500,
    }

    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
    this.onWheel = this.onWheel.bind(this)

    this.parent = new THREE.Object3D()
    this.app.scene.add(this.parent)

    this.instance = new THREE.PerspectiveCamera(75, this.app.viewPort.aspect, 1, 30)
    this.parent.add(this.instance)

    this.helper = new THREE.CameraHelper(this.instance)
    this.app.scene.add(this.helper)

    this.app.viewPort.on('resize', this.resize)
    this.app.ticker.on('tick', this.update)

    this.resize()
  }

  /**
   * addScrollEvents
   */
  addScrollEvents() {
    document.addEventListener('wheel', this.onWheel)
  }

  /**
   * removeScrollEvents
   */
  removeScrollEvents() {
    document.removeEventListener('wheel', this.onWheel)
  }

  /**
   * onWheel
   */
  onWheel(e) {
    const n = normalizeWheel(e)
    this.props.targetScrollSpeed = n.pixelY
  }

  /**
   * calcScrollSpeedToAnimationTime
   */
  calcScrollSpeedToAnimationTime() {
    // 制限
    this.props.targetScrollSpeed = clamp(this.props.targetScrollSpeed, -this.props.scrollSpeedLimit, this.props.scrollSpeedLimit)

    // 計算
    this.props.currentScrollSpeed = lerp(this.props.currentScrollSpeed, this.props.targetScrollSpeed, this.props.scrollSpeedEase)

    // 0.1以下, -0.1以上は0にする
    if (Math.abs(this.props.currentScrollSpeed) <= 0.1) this.props.currentScrollSpeed = 0

    // 減速
    if (this.props.targetScrollSpeed > 0) {
      const value = this.props.targetScrollSpeed - this.props.scrollSpeedFriction
      this.props.targetScrollSpeed = Math.max(value, 0)
    } else if (this.props.targetScrollSpeed < 0) {
      const value = this.props.targetScrollSpeed + this.props.scrollSpeedFriction
      this.props.targetScrollSpeed = Math.min(value, 0)
    }

    // アニメーション再生
    let time = this.action.time + (this.props.currentScrollSpeed * this.props.scrollSpeedToTimeRatio)
    time = time % this.clip.duration
    if (time < 0) time = this.clip.duration + time
    this.action.time = time

    // debug
    // if (this.props.currentScrollSpeed !==0) {
    //   console.log(this.props.targetScrollSpeed, this.props.currentScrollSpeed)
    // }
  }

  /**
   * setupAnimation
   * @param {object} gltf
   */
  setupAnimation(gltf) {
    this.clip = gltf.animations[0]
    this.instance.rotation.copy(gltf.cameras[0].rotation)
    this.mixer = new THREE.AnimationMixer(this.parent)
    this.action = this.mixer.clipAction(this.clip)
    this.action.play()
    this.action.paused = true
    this.addScrollEvents()
    this.debug()
  }

  /**
   * dispose
   */
  dispose() {
    this.removeScrollEvents()
    this.app.viewPort.off('resize', this.resize)

    this.app.scene.remove(this.parent)
    this.parent.remove(this.instance)
    this.app.scene.remove(this.helper)
    this.helper.dispose()
    this.app = null

    this.action.stop()
    this.mixer.uncacheRoot(this.parent)
    this.mixer.uncacheAction(this.action)
    this.mixer.uncacheClip(this.clip)
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
    this.calcScrollSpeedToAnimationTime()
    this.mixer.update(this.app.ticker.deltaTime / 1000)
  }

  /**
   * setTimeWithProgress
   * @param {number} progress
   */
  setTimeWithProgress(progress) {
    this.action.time = this.clip.duration * progress
  }

  /**
   * visibleDebugObjects
   * @param {boolean} visible
   */
  visibleDebugObjects(visible) {
    this.helper.visible = visible
  }

  /**
   * debug
   */
  debug() {
    this.pane = this.app.debug.pane.addFolder({
      title: 'Camera'
    })

    this.pane.addInput(this.props, 'progress', { min: 0, max: 1, step: 0.01 })
      .on('change', (e) => { this.setTimeWithProgress(e.value) })
  }
}