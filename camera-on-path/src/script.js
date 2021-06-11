import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import Points from './classes/Points'

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
}

// Params
const params = {
  debug: true,
  cameraProgress: 0,
  cameraDuration: 5,
}

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#232323')

// Objects
const objectPositions = [
  new THREE.Vector3(-10, 0, 0),
  // new THREE.Vector3(-7.5, 0, 5),
  new THREE.Vector3(-5, 0, 0),
  // new THREE.Vector3(-2.5, 0, -5),
  new THREE.Vector3(0, 0, 0),
  // new THREE.Vector3(2.5, 0, 5),
  new THREE.Vector3(5, 0, 0),
  // new THREE.Vector3(7.5, 0, -5),
  new THREE.Vector3(10, 0, 0),
]

const objectGeometry = new THREE.BoxGeometry(1, 1, 1)
const objectMaterial = new THREE.MeshLambertMaterial({ color: '#54ac8f' })

objectPositions.forEach((position) => {
  const mesh = new THREE.Mesh(objectGeometry, objectMaterial)
  mesh.position.copy(position)
  scene.add(mesh)
})

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.aspect, 1, 30)
const cameraHelper = new THREE.CameraHelper(camera)
camera.position.y = 3
camera.position.z = 20
camera.lookAt(0, 0, 0)
scene.add(camera)
scene.add(cameraHelper)

// DebugCamera
const debugCamera = new THREE.PerspectiveCamera(45, sizes.aspect, 1, 1000)
debugCamera.position.y = 20
debugCamera.position.z = 40
debugCamera.lookAt(0, 0, 0)
scene.add(debugCamera)

// light
const ambientLight = new THREE.AmbientLight(0xFFFFFF)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff)
scene.add(directionalLight)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.canvas'),
  antialias: true,
})
renderer.autoClearColor = false

// resize
function onResize() {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
  camera.aspect = sizes.aspect
  camera.updateProjectionMatrix()
  debugCamera.aspect = sizes.aspect
  debugCamera.updateProjectionMatrix()
}
window.addEventListener('resize', onResize)
onResize()

// カメラポイント
const cameraPositions = [
  new THREE.Vector3(-12.5, 0.7, 0),
  new THREE.Vector3(-10, 0.7, 2.5),
  new THREE.Vector3(-7.5, 0.7, 0),
  new THREE.Vector3(-5, 0.7, -2.5),
  new THREE.Vector3(-2.5, 0.7, 0),
  new THREE.Vector3(0, 0.7, 2.5),
  new THREE.Vector3(2.5, 0.7, 0),
  new THREE.Vector3(5, 0.7, -2.5),
  new THREE.Vector3(7.5, 0.7, 0),
  new THREE.Vector3(10, 0.7, 2.5),
  new THREE.Vector3(12.5, 0.7, 0),
]
const cameraPoints = new Points({
  scene,
  pointColor: '#ff3333',
  divisionPointColor: '#fa9595',
  lineColor: '#ff3333'
})
cameraPoints.setup(cameraPositions)

// カメラ視線ポイント
const cameraLookPositions = [
  new THREE.Vector3(-12, 0.5, 0),
  new THREE.Vector3(-9.5, 0.5, 2.5),
  new THREE.Vector3(-7, 0.5, 0),
  new THREE.Vector3(-4.5, 0.5, -2.5),
  new THREE.Vector3(-2, 0.5, 0),
  new THREE.Vector3(0.5, 0.5, 2.5),
  new THREE.Vector3(3, 0.5, 0),
  new THREE.Vector3(5.5, 0.5, -2.5),
  new THREE.Vector3(8, 0.5, 0),
  new THREE.Vector3(10.5, 0.5, 2.5),
  new THREE.Vector3(13, 0.5, 0),
]
const cameraLookPoints = new Points({
  scene,
  pointColor: '#338fff',
  divisionPointColor: '#99d5fd',
  lineColor: '#cee8fd'
})
cameraLookPoints.setup(cameraLookPositions)

// カメラの移動
function updateCamera() {
  const cameraPosition = cameraPoints.getPosition(params.cameraProgress)
  const lookPosition = cameraLookPoints.getPosition(params.cameraProgress)
  camera.position.copy(cameraPosition)
  camera.lookAt(lookPosition)
}

// controls
const controls = new OrbitControls(debugCamera, renderer.domElement)
controls.enabled = false

// tick
const tick = () => {
  updateCamera()
  if (params.debug) {
    controls.update()
    renderer.clearColor()
    renderer.setViewport(0, 0, sizes.width, sizes.height)
    showDebugObject()
    renderer.render(scene, debugCamera)
    renderer.setViewport(0, 0, sizes.width * 0.3, sizes.width * 0.3 / sizes.aspect)
    hideDebugObject()
    renderer.render(scene, camera)
  } else {
    renderer.clearColor()
    renderer.setViewport(0, 0, sizes.width, sizes.height)
    renderer.render(scene, camera)
  }
  requestAnimationFrame(tick)
}
tick()

// Debug
const pane = new Pane()

// debug view
function enableDebug() {
  controls.enabled = true
  showDebugObject()
}

function disableDebug() {
  controls.enabled = false
  hideDebugObject()
}

function showDebugObject() {
  cameraHelper.visible = true
  cameraPoints.show()
  cameraLookPoints.show()
}

function hideDebugObject() {
  cameraHelper.visible = false
  cameraPoints.hide()
  cameraLookPoints.hide()
}

if (params.debug === true) enableDebug()

pane.addInput(params, 'debug')
  .on('change', () => {
    if (params.debug === true) {
      enableDebug()
    } else {
      disableDebug()
    }
  })

// camera
const cameraPane = pane.addFolder({ title: 'Camera' })

// camera duration
cameraPane.addInput(params, 'cameraDuration', {
  min: 1,
  max: 30,
  step: 0.1,
  label: 'duration',
})

// camera progress
const cameraProgressInput = cameraPane.addInput(params, 'cameraProgress', {
  min: 0,
  max: 1,
  step: 0.001,
  label: 'progress',
})

// play
cameraPane
  .addButton({ title: 'play' })
  .on('click', () => {
    gsap.fromTo(params, { cameraProgress: 0 }, {
      cameraProgress: 1,
      duration: params.cameraDuration,
      ease: 'linear',
      onUpdate: () => {
        cameraProgressInput.refresh()
      }
    })
  })