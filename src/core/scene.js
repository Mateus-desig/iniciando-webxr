import * as THREE from "three"

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111111)

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
  scene.add(light)

  return scene
}