import './style.scss'
import * as THREE from 'three'
import Debug from './classes/Debug'
import Viewport from './classes/Viewport'
import Ticker from './classes/Ticker'
import BoxObject from './classes/BoxObject'

/**
 * App
 */
class App {
  constructor() {
    // instance
    this.viewPort = new Viewport()
    this.ticker = new Ticker()
    this.debug = new Debug({ ticker: this.ticker })

    // create
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createObjects()

    // bind
    this.resize = this.resize.bind(this)
    this.update = this.update.bind(this)

    // event
    this.viewPort.on('resize', this.resize)
    this.ticker.on('tick', this.update)

    // start
    this.resize()
    this.render()
    this.ticker.start()
  }

  /**
   * createScene
   */
  createScene() {
    this.scene = new  THREE.Scene()
  }

  /**
   * createCamera
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.viewPort.aspect)
    this.camera.position.z = 3
    this.scene.add(this.camera)
  }

  /**
   * createRenderer
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.canvas')
    })
  }

  /**
   * resize
   */
  resize() {
    this.camera.aspect = this.viewPort.aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.viewPort.width, this.viewPort.height)
  }

  /**
   * render
   */
  render() {
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * update
   */
  update() {
    this.render()
  }

  /**
   * dispose
   */
  dispose() {
    this.disposeObjects()
    this.debug.dispose()
    this.viewPort.off('resize', this.resize)
    this.viewPort.dispose()
    this.ticker.off('tick', this.update)
    this.ticker.stop()
    this.renderer.clear()
    this.renderer.dispose()
  }

  /**
   * createObjects
   */
  createObjects() {
    this.boxObject = new BoxObject({ app: this })
  }

  /**
   * disposeObjects
   */
  disposeObjects() {
    this.boxObject.dispose()
    this.boxObject = null
  }
}

const app = new App()