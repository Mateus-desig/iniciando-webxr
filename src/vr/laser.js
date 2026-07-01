import * as THREE from "three"

export function Laser(controller1, controller2) {

    // Adicionar uma linha visual de laser para apontar.
    const laserGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.02, 0, -0.01), // posição.
        new THREE.Vector3(0, 0, -5)// Linha apontando para frente
    ])

    // Material do laser.
    const laserMaterial = new THREE.LineBasicMaterial({ color: 0xffffffff })

    // Um laser para cada controle
    const laser1 = new THREE.Line(
        laserGeometry.clone(),
        laserMaterial.clone()
    )

    const laser2 = new THREE.Line(
        laserGeometry.clone(),
        laserMaterial.clone()
    )

    controller1.add(laser1)
    controller2.add(laser2)

    // Raycaster.
    const raycaster = new THREE.Raycaster()
    const tempMatrix = new THREE.Matrix4()

    function updateLaser(controller, laser, objects = []) {

        tempMatrix.identity().extractRotation(controller.matrixWorld)

        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
        raycaster.ray.direction
            .set(0, 0, -1)
            .applyMatrix4(tempMatrix)

        let distance = 5

        if(objects.length > 0) {
            
            const intersects = raycaster.intersectObjects(objects, true)

            if(intersects.length > 0) {
                distance = intersects[0].distance
            }

        }

        const positions = laser.geometry.attributes.position.array
        positions[3] = 0
        positions[4] = 0
        positions[5] = -distance

        laser.geometry.attributes.position.needsUpdate = true

    }

    return {
        updateLaser1: (objects) => updateLaser(controller1, laser1, objects),
        updateLaser2: (objects) => updateLaser(controller2, laser2, objects)
    }

    // const line = new THREE.Line(laserGeometry, material)

    // controller1.add(line.clone())
    // controller2.add(line.clone())

}