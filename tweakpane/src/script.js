import './style.scss'
import * as THREE from 'three'
import { Pane } from 'tweakpane'

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Params
const params = {
  speed: 0.01,
  color: '#00ccff',
}

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: params.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.canvas')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// resize
window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// tick
const tick = () => {
  mesh.rotation.y += params.speed
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()

// debug
const pane = new Pane()

// 数値（Number）
pane.addInput(params, 'speed', {
  min: 0,
  max: 0.1,
  step: 0.01,
})

// ON / OFF（Boolean）
pane.addInput(mesh, 'visible')

// Color（Color, Event）
pane.addInput(params, 'color')
  .on('change', (ev) => {
    material.color.set(ev.value)
  })

// Vector3（Point 3D）
pane.addInput(camera, 'position', {
  x: { min: -30, max: 30, step: 0.1 },
  y: { min: -30, max: 30, step: 0.1 },
  z: { min: 3, max: 30, step: 0.1 },
})

// Texture（Button, Event）
// inputタグ作成
const inputElm = document.createElement('input')
inputElm.setAttribute('type', 'file')
inputElm.setAttribute('accept', 'image/png, image/jpeg')
inputElm.addEventListener('change', (e) => {
  // file読み込み
  const reader = new FileReader()
  reader.onload = (e) => {
    const imgElem = document.createElement('img')
    imgElem.onload = () => {
      // Texture設定
      const texture = new THREE.Texture(imgElem)
      texture.needsUpdate = true
      material.map = texture
      material.needsUpdate = true
      document.body.appendChild(imgElem)
    }
    imgElem.src = e.target.result
  }
  reader.readAsDataURL(inputElm.files[0])
})
// pane設定
pane
  .addButton({
    label: 'Texture',
    title: 'file',
  })
  .on('click', () => {
    inputElm.click()
  })

// Export
const consoleParams = {
  console: '',
}
const exportPane = pane.addFolder({
  title: 'Export'
})
const monitor = exportPane.addMonitor(consoleParams, 'console', {
  multiline: true,
})
const monitorTextareaElm = monitor.controller_.view.valueElement.querySelector('textarea')
monitorTextareaElm.removeAttribute('readonly') // 選択してコピーできるように
exportPane.addButton({ title: 'Export' })
  .on('click', () => {
    const preset = pane.exportPreset()
    consoleParams.console = JSON.stringify(preset, null, 2)
  })
