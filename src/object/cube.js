import * as THREE from "three"

export function Cube(scene, renderer, camera, x, y, z) {

    // Criando cubo.
    const textureLoader = new THREE.TextureLoader()
    const coloTexture = textureLoader.load('./src/textures/bedrock.webp') // Textura do cubo

    const material = new THREE.MeshStandardMaterial({
        map: coloTexture
    })

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        material
        // new THREE.MeshNormalMaterial()
    )

    cube.castShadow = true

    cube.position.set(x, y, z)

    // Adicionando cubo no espaço.
    scene.add(cube)

    return cube

}