import * as THREE from "three"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js"

import { Laser } from "./laser.js"

export function setupControllers(renderer, scene) {

  // Criar e configurar o primeiro controlador (Mão Direita/Esquerda - Index 0)
  const controller1 = renderer.xr.getController(0)
  scene.add(controller1)

  // Criar e configurar o segundo controlador (Index 1)
  const controller2 = renderer.xr.getController(1)
  scene.add(controller2)

  const { updateLaser1, updateLaser2 } = Laser(controller1, controller2)

  // (Opcional) Adicionar modelos 3D visuais dos controles reais (Oculus, Vive, etc.)
  const controllerModelFactory = new XRControllerModelFactory()

  const controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  scene.add(controllerGrip1)

  const controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  scene.add(controllerGrip2)

  return { controller1, controller2, updateLaser1, updateLaser2 }

}