import EventEmitter from 'events'
import debounce from 'debounce'
import * as THREE from "three";

/**
 * BoxObject
 */
export default class BoxObject {
  constructor({ app }) {
    this.app = app

    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.app.scene.add(this.mesh)

    this.update = this.update.bind(this)
    this.app.ticker.on('tick', this.update)
  }

  /**
   * update
   */
  update() {
    this.mesh.rotation.y += 0.01
  }

  /**
   * dispose
   */
  dispose() {
    this.app.scene.remove(this.mesh)
    this.app.ticker.off('tick', this.update)
    this.app = null

    this.geometry.dispose()
    this.material.dispose()
  }
}