import * as THREE from 'three'

/**
 * Camera
 */
export default class Camera {
  constructor({ app }) {
    this.app = app

    this.props = {
      progress: 0,
    }

    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)

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
    this.debug()
  }

  /**
   * dispose
   */
  dispose() {
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