import * as THREE from "three"

export function Light(scene) {

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Luz Ambiente (Iluminação geral e suave) ilumina todo o espaço.
    // Parâmetros: (Cor da luz, Intensidade).
    // const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5)
    // scene.add(ambientLight)

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // 3. Luz Direcional (Simula o sol, cria sombras e relevos nas texturas)
    // Parâmetros: (Cor da luz, Intensidade)

    const directionalLight = new THREE.DirectionalLight(0xffffff,1.5)

    // Posicionar a luz no espaço (X, Y, Z)
    directionalLight.position.set(1,20,1)

    // Ativar a capacidade de projetar sombras (opcional, mas recomendado).
    directionalLight.castShadow = true

    // O padrão é 512. Mudar para 1024 ou 2048 melhora drasticamente a definição
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048

    scene.add(directionalLight)

    /////////////////////////////////////////////////////////////////////////////////////////////////////

}