import "./style.css"

import * as THREE from "three"

import { createRenderer } from "./core/renderer"
import { createScene } from "./core/scene"
import { createCamera } from "./core/camera"

import { Light } from "./object/light"
import { Floor } from "./object/floor"
import { Cube } from "./object/cube"

import { setupXR } from "./vr/xr"
import { setupControllers } from "./vr/controllers"
import { setupDesktopInput } from "./input/desktopInput"

const app = document.querySelector("#app")

const renderer = createRenderer()
const scene = createScene()
const { camera, controls } = createCamera(renderer)

setupXR(renderer)
setupControllers(renderer, scene)
setupDesktopInput(camera)

const cube = [
    Cube(scene, renderer, camera, 1, 1, 1),
     Cube(scene, renderer, camera, -1, 1, 1)
]
// Cubo magico.
// for (let t = 1; t < 16; t++) {
//     for (let o = 0; o < 9; o++) {
//         for (let index = -8; index < 9; index++) {
//             cube.push(Cube(scene, renderer, camera, index, t, o))
//         }
//     }
// }

Light(scene)
Floor(scene)

// LOOP UNIFICADO (IMPORTANTE)
renderer.setAnimationLoop(() => {

    controls.update()

    cube.forEach(cb => {
        cb.rotation.y += 0.05
        cb.rotation.x += 0.05
    })

    renderer.render(scene, camera)

})

// resize.
window.addEventListener("resize", () => {
    camera.aspect = app.clientWidth / app.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})