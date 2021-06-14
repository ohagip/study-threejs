import * as THREE from 'three'

/**
 * Points
 * @param {Object} options
 * @param {THREE.Scene} options.scene
 * @param {THREE.Vector3[]} options.point
 *
 */
export default class Points {
  constructor({ scene, point }) {
    this.scene = scene

    // Geometry
    this.pointGeometry = new THREE.OctahedronGeometry(0.2)
    this.splinePointGeometry = new THREE.OctahedronGeometry(0.1)
    this.lineGeometry = null

    // Material
    this.pointMaterial = new THREE.MeshLambertMaterial({ color: '#ff3333' })
    this.splinePointMaterial = new THREE.MeshLambertMaterial({ color: '#fa9595' })
    this.lineMaterial = new THREE.MeshLambertMaterial({ color: '#ffcccc' })

    // Mesh
    this.pointMeshes = []
    this.splineMeshes = []
    this.line = null

    // Curve
    this.pointSplineNum = 50
    this.pointCurve = null

    this.setPoint(point)
  }

  /**
   * setPoint
   * @param {THREE.Vector3[]} positions
   */
  setPoint(positions) {
    this.remove()

    // ポイント
    positions.forEach((point) => {
      const mesh = new THREE.Mesh(this.pointGeometry, this.pointMaterial)
      mesh.position.copy(point)
      this.pointMeshes.push(mesh)
      this.scene.add(mesh)
    })

    // 分割したポイント
    this.pointCurve = new THREE.CatmullRomCurve3(positions, true)
    const splinePoints = this.pointCurve.getPoints(this.pointSplineNum)
    splinePoints.forEach((point) => {
      const mesh = new THREE.Mesh(this.splinePointGeometry, this.splinePointMaterial)
      mesh.position.copy(point)
      this.splineMeshes.push(mesh)
      this.scene.add(mesh)
    })

    // line
    this.lineGeometry = new THREE.BufferGeometry().setFromPoints(splinePoints)
    this.line = new THREE.Line(this.lineGeometry, this.lineMaterial)
    this.scene.add(this.line)
  }

  /**
   * getPosition
   * @param {number} progress - range 0-1
   * @return {THREE.Vector3}
   */
  getPosition(progress) {
    const position = new THREE.Vector3()

    if (this.pointCurve === null) {
      console.error(`[Points] getPosition: this.pointCurve === null`)
    } else {
      this.pointCurve.getPointAt(progress, position)
    }

    return position
  }

  show() {
    this.pointMeshes.forEach((mesh) => {
      mesh.visible = true
    })
    this.splineMeshes.forEach((mesh) => {
      mesh.visible = true
    })
    if (this.line !== null) this.line.visible = true
  }

  hide() {
    this.pointMeshes.forEach((mesh) => {
      mesh.visible = false
    })
    this.splineMeshes.forEach((mesh) => {
      mesh.visible = false
    })
    if (this.line !== null) this.line.visible = false
  }

  remove() {
    this.pointMeshes.forEach((mesh) => {
      this.scene.remove(mesh)
    })
    this.splineMeshes.forEach((mesh) => {
      this.scene.remove(mesh)
    })
    if (this.line !== null) this.scene.remove(this.line)
  }

  dispose() {
    this.remove()

    this.pointMaterial.dispose()
    this.splinePointMaterial.dispose()
    this.lineMaterial.dispose()

    this.pointGeometry.dispose()
    this.splinePointGeometry.dispose()
    if (this.lineGeometry !== null) this.lineGeometry.dispose()
  }
}