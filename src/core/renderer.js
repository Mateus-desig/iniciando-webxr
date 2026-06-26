import * as THREE from "three"
import { texture } from "three/tsl"

export function createRenderer() {

    const container = document.querySelector("#app")

    const renderer = new THREE.WebGLRenderer({
        antialias: true// Remove as bordas serrilhadas
    })

    renderer.setSize(1900, 890)

    // Ajusta os pixels para a densidade do monitor (limitado a 2 para não pesar em telas 4K)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // Garante cores realistas e mapeamento correto de luz PBR
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0 // Ajuste a exposição aqui se ficar escuro

    renderer.xr.enabled = true
    renderer.shadowMap.enabled = true

    // Ative um filtro de sombra mais suave (PCFT Soft Shadows)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Verifica o máximo que a placa de vídeo do usuário aguenta
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

    // Aplique isso na textura do seu chão
    texture.maxAnisotropy = maxAnisotropy
    
    container.appendChild(renderer.domElement)

    return renderer
}