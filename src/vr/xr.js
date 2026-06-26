import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

export function setupXR(renderer) {
  document.body.appendChild(VRButton.createButton(renderer))
}