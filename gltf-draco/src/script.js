import './style.scss'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
dracoLoader.preload()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdddddd)

// Model
let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
// gltfLoader.load('./models/adamHead.gltf', (gltf) => {
gltfLoader.load('./models/adamHead-draco.glb', (gltf) => {
  model = gltf.scene.children[0]
  scene.add(gltf.scene)
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)

// light
const ambientLight = new THREE.AmbientLight(0xFFFFFF)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff)
scene.add(directionalLight)

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
  if (model !== null) model.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()