import * as THREE from "three"


export function Floor(scene) {

    const textureLoader = new THREE.TextureLoader()
    const coloTexture = textureLoader.load('./src/textures/floor.jpg') // Textura do cubo


    // Criar a geometria do chão (Largura, Altura)
    const floorGeometry = new THREE.PlaneGeometry(20, 20)

    // Criar o material (pode usar uma cor sólida ou aplicar uma textura de chão aqui)
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: coloTexture, // textura
        // color: 0x808080, // Cor cinza neutra
        roughness: 0.8   // Chão mais fosco para refletir a luz de forma realista
    })

    // Criar a malha (Mesh) combinando geometria e material
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)

    // ROTACIONAR: Por padrão, o plano nasce em pé (vertical). 
    // Precisamos deitá-lo girando 90 graus no eixo X.
    floor.rotation.x = - Math.PI * 0.5

    // SOMBRAS: Definir que o chão vai RECEBER as sombras dos outros objetos
    floor.receiveShadow = true

    scene.add(floor)

}