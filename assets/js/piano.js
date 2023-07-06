import * as THREE from 'three';
import {note} from '../js/notes.js'

export const scene = new THREE.Scene()
const canvas = document.getElementById("canvas")
const renderer = new THREE.WebGLRenderer({
    canvas,
    // alpha: true,
    antialias:true
});
// const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100) // perspective camera
let width = 50
let height = 50
// 50/50 for testing, 175/30 for later
// let width = 175
// let height = 30
let camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000) // orthrographic camera

function updateCamera(){
    // camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000)
    console.log(`width: ${width}`)
    console.log(`height: ${height}`)
    // scene.add(camera)
    camera.left = width / - 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = height / - 2
    camera.updateProjectionMatrix()
}

camera.position.z = 20
scene.add(camera)
const keyboard = new THREE.Object3D()
const light = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(light)
const noteGeometry = new THREE.BoxGeometry(1.8, 4.8, 1.1)
const noteBorderGeometry = new THREE.BoxGeometry(2, 5, 1)
export const noteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
const noteBorderMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

const numNotes = 8
for(let i = 0; i < numNotes; i++){
    const noteMesh = new THREE.Mesh(noteGeometry, noteMaterial)
    const noteBorderMesh = new THREE.Mesh(noteBorderGeometry, noteBorderMaterial)
    const note = new THREE.Object3D()
    note.add(noteMesh)
    note.add(noteBorderMesh)
    note.position.x = -numNotes + 1 + 2 * i
    keyboard.add(note)
}
scene.add(keyboard)

// const vec = new THREE.Vector3()
// camera.lookAt(keyboard.getWorldPosition(vec))
renderer.render(scene, camera)

document.addEventListener("keydown", (event) => {
    updateCamera()
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

document.getElementById("width").addEventListener("input", ()=> {
    width = document.getElementById("width").value
    width = parseInt(width)
    updateCamera()
})
document.getElementById("height").addEventListener("input", ()=> {
    height = document.getElementById("height").value
    height = parseInt(height)
    updateCamera()
})

let firstNote = new note(0, 1)
firstNote.generateObject()

function render(){
    // keyboard.rotation.x += 0.01
    firstNote.moveDown()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)