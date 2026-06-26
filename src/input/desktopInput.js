export function setupDesktopInput(camera) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2

    camera.rotation.y = x * 1.2
    camera.rotation.x = y * 0.8
  })
}