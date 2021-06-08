import './style.scss'
import * as THREE from 'three'

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
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
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()