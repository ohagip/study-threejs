import * as THREE from 'three'

/**
 * Points
 * @param {Object} options
 * @param {THREE.Scene} options.scene
 * @param {string} options.pointColor - ポイントのカラーコード
 * @param {string} options.divisionPointColor - 分割ポイントのカラーコード
 * @param {string} options.lineColor - ラインコード
 *
 */
export default class Points {
  constructor({ scene, pointColor, divisionPointColor, lineColor }) {
    this.scene = scene

    // Geometry
    this.pointGeometry = new THREE.OctahedronGeometry(0.2)
    this.divisionPointGeometry = new THREE.OctahedronGeometry(0.1)
    this.lineGeometry = null

    // Material
    this.pointMaterial = new THREE.MeshLambertMaterial({ color: pointColor })
    this.divisionPointMaterial = new THREE.MeshLambertMaterial({ color: divisionPointColor })
    this.lineMaterial = new THREE.MeshLambertMaterial({ color: lineColor })

    // Mesh
    this.pointMeshes = []
    this.divisionMeshes = []
    this.line = null

    // Curve
    this.pointDivisionNum = 50
    this.pointCurve = null
  }

  /**
   * setup
   * @param {THREE.Vector3[]} positions
   */
  setup(positions) {
    this.remove()

    // ポイント
    positions.forEach((point) => {
      const mesh = new THREE.Mesh(this.pointGeometry, this.pointMaterial)
      mesh.position.copy(point)
      this.pointMeshes.push(mesh)
      this.scene.add(mesh)
    })

    // 分割したポイント
    this.pointCurve = new THREE.CatmullRomCurve3(positions)
    const divisionPoints = this.pointCurve.getPoints(this.pointDivisionNum)
    divisionPoints.forEach((point) => {
      const mesh = new THREE.Mesh(this.divisionPointGeometry, this.divisionPointMaterial)
      mesh.position.copy(point)
      this.divisionMeshes.push(mesh)
      this.scene.add(mesh)
    })

    // line
    this.lineGeometry = new THREE.BufferGeometry().setFromPoints(divisionPoints)
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
    this.divisionMeshes.forEach((mesh) => {
      mesh.visible = true
    })
    if (this.line !== null) this.line.visible = true
  }

  hide() {
    this.pointMeshes.forEach((mesh) => {
      mesh.visible = false
    })
    this.divisionMeshes.forEach((mesh) => {
      mesh.visible = false
    })
    if (this.line !== null) this.line.visible = false
  }

  remove() {
    this.pointMeshes.forEach((mesh) => {
      this.scene.remove(mesh)
    })
    this.divisionMeshes.forEach((mesh) => {
      this.scene.remove(mesh)
    })
    if (this.line !== null) this.scene.remove(this.line)
  }

  dispose() {
    this.remove()

    this.pointMaterial.dispose()
    this.divisionPointMaterial.dispose()
    this.lineMaterial.dispose()

    this.pointGeometry.dispose()
    this.divisionPointGeometry.dispose()
    if (this.lineGeometry !== null) this.lineGeometry.dispose()
  }
}