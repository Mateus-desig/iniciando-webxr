import "./style.css"

import * as THREE from "three"

const dinamicBlocks = []// Array para guardar os blocos criados.
const grabingObject = new Map()// Guarda qual controle está segurando qual bloco.

// Configuração básica do Raycaster para interações.
const raycaster = new THREE.Raycaster()
const tempMatrix = new THREE.Matrix4()

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

const { controller1, controller2, updateLaser1, updateLaser2 } = setupControllers(renderer, scene)
setupDesktopInput(camera)

const cube = [
    // Cube(scene, renderer, camera, 2, 1, 1),
    // Cube(scene, renderer, camera, -2, 1, 1)
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

        model.position.set(0, 1, 5)
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
        // animate()

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

    // Calcula o tempo que passou desde o último frame
    const delta = clock.getDelta()

    // Se o mixer já tiver sido criado, atualiza a animação
    if (mixer) {
        mixer.update(delta)
    }

    renderer.render(scene, camera)

}





// Função que calcula o raio laser do controle e retorna se bateu em algo.
function intersectionLaser(controller) {
    tempMatrix.identity().extractRotation(controller.matrixWorld)
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)

    const intersects = raycaster.intersectObjects(dinamicBlocks)
    return intersects.length > 0 ? intersects[0] : null
}

// Função para gerar o bloco no espaço 3D.
function genFrontCube(controller) {
    // Cria a geometria e material do cubo.
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2) // Tamanho: 20cm.
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff }) // Cor aleatória.
    const bloco = new THREE.Mesh(geometry, material)

    // Calcula uma posição a 1.5 metros à frente de onde o controle está apontando.
    const posicaoAlvo = new THREE.Vector3(0, 0, -1.5)
    posicaoAlvo.applyMatrix4(controller.matrixWorld)

    bloco.position.copy(posicaoAlvo)

    // Adiciona na cena e na lista de blocos interagíveis.
    scene.add(bloco)
    dinamicBlocks.push(bloco)
}

function controllEvents(controller) {

    // GERAR BLOCO (Gatilho Frontal) ----.
    controller.addEventListener("selectstart", (e) => {

        const ctrl = e.target

        // Verifica se o laser está apontando para o vazio para criar um bloco.
        const intersection = intersectionLaser(ctrl)

        if (!intersection) {

            // Se não apontou para nada, gera um bloco na ponta do laser (ex: 2 metros à frente).
            genFrontCube(ctrl)

        }

        // ---- AGARRAR BLOCO (Botão da Garra / Squeeze) ----.
        controller.addEventListener("squeezestart", (e) => {

            const ctrl = e.target
            const intersection = intersectionLaser(ctrl)

            if (intersection && dinamicBlocks.includes(intersection.object)) {

                const block = intersection.object

                // Salva a relação no Map
                grabingObject.set(ctrl, block)

                // Prende o bloco temporariamente como "filho" do controle na árvore do Three.js
                // Isso faz com que ele mova e rotacione junto com a sua mão automaticamente!
                ctrl.attach(block)

            }

        })

        // ---- SOLTAR BLOCO ----.
        controller.addEventListener("squeezeend", (e) => {

            const ctrl = e.target
            const block = grabingObject.get(ctrl)

            if (block) {

                // Devolve o bloco para a cena global para ele parar de seguir o controle.
                scene.attach(block)
                grabingObject.delete(ctrl) // Remove a referência do Map.

            }

        })

    })

}


// Aplique a função nos seus dois controles existentes.
controllEvents(controller1)
controllEvents(controller2)











Light(scene)
Floor(scene)

// LOOP UNIFICADO (IMPORTANTE)
renderer.setAnimationLoop(() => {

    controls.update()

    updateLaser1(dinamicBlocks)
    updateLaser2(dinamicBlocks)

    /////////////////////////////

    // Calcula o tempo que passou desde o último frame
    const delta = clock.getDelta()

    // Se o mixer já tiver sido criado, atualiza a animação
    if (mixer) {
        mixer.update(delta)
    }

    /////////////////////////////

    // Cubos
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