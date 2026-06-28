import "./style.css"

import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { createRenderer } from "./core/renderer"
import { createScene } from "./core/scene"
import { createCamera } from "./core/camera"

import { Light } from "./object/light"
import { Floor } from "./object/floor"
import { Cube } from "./object/cube"

import { setupXR } from "./vr/xr"
import { setupControllers } from "./vr/controllers"
import { setupDesktopInput } from "./input/desktopInput"

const loader = new GLTFLoader()

const app = document.querySelector("#app")

const renderer = createRenderer()
const scene = createScene()
const { camera, controls } = createCamera(renderer)

setupXR(renderer)
setupControllers(renderer, scene)
setupDesktopInput(camera)

const cube = [
    Cube(scene, renderer, camera, 2, 1, 1),
    Cube(scene, renderer, camera, -2, 1, 1)
]

let mixer
const clock = new THREE.Clock()


loader.load(
    './src/3d/parametric_sliderball.glb',
    (gltf) => {

        const model = gltf.scene

        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.reciveShadow = true
            }
        })

        model.position.set(0, 1, 0)
        model.scale.set(.5, .5, .5)

        scene.add(model)

        // --- CONTROLE DA ANIMAÇÃO ---
        if (gltf.animations && gltf.animations.length > 0) {

            // Cria o player de animação para o modelo
            mixer = new THREE.AnimationMixer(model)

            // Busca o clip de animação chamado "Animation" que você enviou
            const clip = THREE.AnimationClip.findByName(gltf.animations, 'Animation')

            if (clip) {
                const action = mixer.clipAction(clip)
                action.play() // Inicia a reprodução
            }

        }
        // Inicia o loop (garanta que essa chamada existe no seu código)
        animate()

        console.log(gltf.animations) // Mostra os nomes de todas as animações (ex: "Walk", "Run", "Idle")

    },
    (xhr) => {
        // Mostra o progresso do carregamento no console
        console.log((xhr.loaded / xhr.total * 100) + '% carregado')
    },
    (error) => {
        // Captura eventuais erros (ex: caminho errado)
        console.error('Erro ao carregar o modelo:', error)
    }

)

function animate() {

    requestAnimationFrame(animate)

    // Calcula o tempo que passou desde o último frame
    const delta = clock.getDelta()

    // Se o mixer já tiver sido criado, atualiza a animação
    if (mixer) {
        mixer.update(delta)
    }

    renderer.render(scene, camera)
    
}



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