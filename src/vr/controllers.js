import * as THREE from "three"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js"

export function setupControllers(renderer, scene) {
  const controller1 = renderer.xr.getController(0)
  const controller2 = renderer.xr.getController(1)

  scene.add(controller1)
  scene.add(controller2)

  const factory = new XRControllerModelFactory()

  const grip1 = renderer.xr.getControllerGrip(0)
  const model1 = factory.createControllerModel(grip1)
  grip1.add(model1)

  const grip2 = renderer.xr.getControllerGrip(1)
  const model2 = factory.createControllerModel(grip2)
  grip2.add(model2)

  scene.add(grip1, grip2)

  return { controller1, controller2 }
}