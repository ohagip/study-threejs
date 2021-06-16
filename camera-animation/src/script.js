import './style.scss'
import EventEmitter from 'events'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Debug from './classes/Debug'
import Viewport from './classes/Viewport'
import Ticker from './classes/Ticker'
import BoxObject from './classes/BoxObject'
import PlaneObject from './classes/PlaneObject'
import Camera from './classes/Camera'
import DebugCamera from './classes/DebugCamera'

/**
 * App
 * @extends {EventEmitter}
 */
class App extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(100)

    // props
    this.props = {
      debugMode: false,
    }

    // instance
    this.viewPort = new Viewport()
    this.ticker = new Ticker()
    this.debug = new Debug({ ticker: this.ticker })

    // create
    this.createScene()
    this.createRenderer()
    this.createCamera()
    this.createObjects()

    // bind
    this.resize = this.resize.bind(this)
    this.update = this.update.bind(this)

    // event
    this.viewPort.on('resize', this.resize)
    this.ticker.on('tick', this.update)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load('./camera-path.gltf', (gltf) => {
      console.log('gltf', gltf)
      // start
      this.setupDebug()
      this.camera.setupAnimation(gltf)
      this.resize()
      this.render()
      this.ticker.start()

      // dispose debug
      // setTimeout(() => {
      //   this.dispose()
      // }, 1000)
    })
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
    this.camera = new Camera({ app: this })
    this.debugCamera = new DebugCamera({ app: this })
  }

  /**
   * disposeCamera
   */
  disposeCamera() {
    this.camera.dispose()
    this.debugCamera.dispose()
  }

  /**
   * createRenderer
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.canvas'),
      antialias: true,
    })
    this.renderer.autoClearColor = false
  }

  /**
   * resize
   */
  resize() {
    this.renderer.setSize(this.viewPort.width, this.viewPort.height)
  }

  /**
   * render
   */
  render() {
    const { width, height } = this.viewPort

    if (this.props.debugMode === true) {
      this.visibleDebugObjects(true)
      this.renderer.clearColor()
      this.renderer.setViewport(0, 0, width, height)
      this.renderer.render(this.scene, this.debugCamera.instance)
      this.visibleDebugObjects(false)
      this.renderer.setViewport(0, 0, width * 0.3, height * 0.3)
      this.renderer.render(this.scene, this.camera.instance)
    } else {
      this.visibleDebugObjects(false)
      this.renderer.clearColor()
      this.renderer.setViewport(0, 0, width, height)
      this.renderer.render(this.scene, this.camera.instance)
    }
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
    this.disposeCamera()
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
    this.blaneObject = new PlaneObject({ app: this })
  }

  /**
   * disposeObjects
   */
  disposeObjects() {
    this.boxObject.dispose()
    this.boxObject = null
    this.blaneObject.dispose()
    this.blaneObject = null
  }

  /**
   * setupDebug
   */
  setupDebug() {
    this.debug.pane.addInput(this.props, 'debugMode')
      .on('change', () => {
        console.log(`changeDebugMode: ${this.props.debugMode}`)
        this.emit('debugMode', this.props.debugMode)
      })
  }

  /**
   * visibleDebugObjects
   * @param {boolean} visible
   */
  visibleDebugObjects(visible) {
    this.camera.visibleDebugObjects(visible)
  }
}

const app = new App()