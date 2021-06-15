import * as THREE from 'three'

/**
 * PlaneObject
 */
export default class PlaneObject {
  constructor({ app }) {
    this.app = app

    this.geometry = new THREE.PlaneGeometry(10, 10, 10)
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.y = -0.5
    this.mesh.rotation.x = -90 * (Math.PI / 180)
    this.app.scene.add(this.mesh)
  }

  /**
   * dispose
   */
  dispose() {
    this.app.scene.remove(this.mesh)
    this.app = null
    this.geometry.dispose()
    this.material.dispose()
  }
}