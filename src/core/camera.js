import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

export function createCamera(renderer) {

  const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true
  controls.dampingFactor = 0.05

  camera.position.set(0, 3, -5)

return { camera, controls }
}