import * as THREE from 'three';

const scene = new THREE.Scene()
const canvas = document.getElementById("canvas")
const renderer = new THREE.WebGLRenderer({
    canvas,
    // alpha: true,
    antialias:true
});
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100)
camera.position.z = 20
// camera.rotation.y += Math.PI/2
// camera.position.y += 1
scene.add(camera)
const keyboard = new THREE.Object3D()
const light = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(light)
const noteGeometry = new THREE.BoxGeometry(2, 5, 1)
const noteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
// const noteMesh = new THREE.Mesh(noteGeometry, noteMaterial)

// const noteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})

for(let i = 0; i < 8; i++){
    const noteMesh = new THREE.Mesh(noteGeometry, noteMaterial)
    noteMesh.position.x = -7 + 2 * i
    keyboard.add(noteMesh)
}
scene.add(keyboard)

// const vec = new THREE.Vector3()
// camera.lookAt(keyboard.getWorldPosition(vec))
renderer.render(scene, camera)

document.addEventListener("keydown", (event) => {
    if(event.keyCode == 37){
        camera.position.x += -0.1
    } else if(event.keyCode == 39){
        camera.position.x += 0.1
    } else if(event.keyCode == 38){
        camera.position.y += -0.1
    } else if(event.keyCode == 40){
        camera.position.y += 0.1
    }

    renderer.render(scene, camera)
})

function render(){
    keyboard.rotation.x += 0.01
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
// requestAnimationFrame(render)