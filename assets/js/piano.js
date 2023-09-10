import * as THREE from 'three';
import {note} from '../js/notes.js'
import * as LOGIC from '../js/index.js'

export const scene = new THREE.Scene()
const canvas = document.getElementById("canvas")
const renderer = new THREE.WebGLRenderer({
    canvas,
    // alpha: true,
    antialias:true
});
// const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100) // perspective camera
// let cameraWidth = 50
// export let cameraHeight = 50
// 50/50 for testing, 175/30 for later
let cameraWidth = 175
export let cameraHeight = 50
let camera = new THREE.OrthographicCamera(cameraWidth / - 2, cameraWidth / 2, cameraHeight / 2, cameraHeight / - 2, 1, 1000) // orthrographic camera

function updateCamera(){
    console.log(`width: ${cameraWidth}`)
    console.log(`height: ${cameraHeight}`)
    // scene.add(camera)
    camera.left = cameraWidth / - 2
    camera.right = cameraWidth / 2
    camera.top = cameraHeight / 2
    camera.bottom = cameraHeight / - 2
    camera.updateProjectionMatrix()
}

camera.position.z = 20
camera.position.y = (cameraHeight - 5)/2
scene.add(camera)
const keyboard = new THREE.Object3D()
// const light = new THREE.AmbientLight(0xFFFFFF, 1)
// scene.add(light)
const noteGeometry = new THREE.BoxGeometry(1.8, 4.8, 1.1)
const noteBorderGeometry = new THREE.BoxGeometry(2, 5, 1)
export const noteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
const noteBorderMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

const numNotes = 88
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

// document.addEventListener("keydown", (event) => {
//     updateCamera()
//     if(event.keyCode == 37){
//         camera.position.x += -0.1
//     } else if(event.keyCode == 39){
//         camera.position.x += 0.1
//     } else if(event.keyCode == 38){
//         camera.position.y += -0.1
//     } else if(event.keyCode == 40){
//         camera.position.y += 0.1
//     }

//     renderer.render(scene, camera)
// })

document.getElementById("width").addEventListener("input", ()=> {
    cameraWidth = document.getElementById("width").value
    cameraWidth = parseInt(cameraWidth)
    updateCamera()
})

document.getElementById("height").addEventListener("input", ()=> {
    cameraHeight = document.getElementById("height").value
    cameraHeight = parseInt(cameraHeight)
    updateCamera()
})

// let firstNote = new note(0, 1)
// let secondNote = new note(1, 1)
let i = 0

export let notes = []
document.getElementById("canvas").onclick = () => {console.log(notes); console.log("start"); console.log(j); setTimeout(()=> {console.log("end")}, 1000)}
document.getElementById("canvas2").onclick = () => {requestAnimationFrame(render2)}

// for(let i = 0; i < 127; i++){
//     notes[i] = false
// }

let start = -1
let del = 0
let rawDelay = 0
let rawDelayAfter = 0
let firstRun = -1
const frameRate = 60
// export let j = 7999
// export let j = 8432
export let j = 415
let endJ = 0
let startTime = 0
// export let j = 2400

export function startSetUp(renderloop){
    endJ = j + 1000
    setUp(renderloop)
}
export function startSetUp2(){
    endJ = j + 400
    setUp()
}


export function setUp(renderloop){
    if(del == 0){
        // console.log("start " + Date.now())
        startTime = Date.now()
        del = 1
    }
    //hope this works :)

    rawDelay = LOGIC.getTimeDelay()
    rawDelayAfter = LOGIC.getTimeDelayAfter()

    const max = notes.length > 50 ? notes.length - 50 : 0

    for(let i = notes.length - 1; i >= max; i--){
        const note = notes[i]
        if(note.on){
            // adds stored delay to the length of the note
            note.extendByDelay(rawDelayAfter)
        }
    }

    if(rawDelay === 0){
        j = LOGIC.renderLoop(j)
        start = -1
        if(notes.length < 100){
            setUp(renderloop)
        } else{
            if(renderloop){
                requestAnimationFrame(render2)
            }
            console.log(`time: ${Date.now()-startTime}`)
            del = 0
        }
        return
    }

    j = LOGIC.renderLoop(j) // runs through the binary loop once
    if(notes.length < 100){
            setUp(renderloop)
    } else{
        if(renderloop){
            requestAnimationFrame(render2)
        }
        console.log(`time: ${Date.now()-startTime}`)
        del = 0
    } // makes notes fall infinitely
}

export function setUp2(){
    if(del == 0){
        // console.log("start " + Date.now())
        startTime = Date.now()
        del = 1
    }
    //hope this works :)

    rawDelay = LOGIC.getTimeDelay()
    rawDelayAfter = LOGIC.getTimeDelayAfter()

    const max = notes.length > 50 ? notes.length - 50 : 0


    for(let i = notes.length - 1; i >= max; i--){
        const note = notes[i]
        if(note.on){
            // adds stored delay to the length of the note
            note.extendByDelay(rawDelayAfter)
        }
    }

    if(rawDelay === 0){
        j = LOGIC.renderLoop(j)
        if(j < endJ){
            setUp2()
        } else {
            console.log(`time: ${Date.now()-startTime}`)
            del = 0
        }
        return
    }

    j = LOGIC.renderLoop(j) // runs through the binary loop once
    if(j < endJ){
            setUp2()
    } else {
        console.log(`time: ${Date.now()-startTime}`)
        del = 0
    }
}


export function render(time){


    if (start === -1) {
        start = Date.now()
        rawDelay = LOGIC.getTimeDelay()
        rawDelayAfter = LOGIC.getTimeDelayAfter()
    }

    // const elapsed = time - start

    const max = notes.length > 50 ? notes.length - 50 : 0

    // const notesLen = notes.length

    for(let i = notes.length - 1; i >= max; i--){
        // removes note if not visible
        const note = notes[i]
        if(note.on){
            // adds stored delay to the length of the note
            note.extendByDelay(rawDelayAfter)
        }
    }

    // does not make notes fall if there is no delay
    if(rawDelay === 0){
        j = LOGIC.renderLoop(j)
        start = -1
        if(j < 10000){
            requestAnimationFrame(render)
        } else{requestAnimationFrame(render2)}
        return
    }

    // moves notes based on state
    for(let i = 0; i < notes.length; i++){
        // removes note if not visible
        const note = notes[i]
        if((note.object.position.y) < 0){
            note.remove()
            notes.splice(i, 1)
        }
        note.moveDown(20/frameRate)
    }

    renderer.render(scene, camera)



    // code to keep constant framerate
    j = LOGIC.renderLoop(j) // runs through the binary loop once
    const elapsed = Date.now() - start
    start = -1 // resets start for next loop
    if(j < 10000){
        if(elapsed > 1000/frameRate){
            requestAnimationFrame(render)
        } else {
            setTimeout(requestAnimationFrame, 1000/frameRate - elapsed, render)
        }
    } else{requestAnimationFrame(render2)} // makes notes fall infinitely
}

// makes notes fall infinitely
export function render2(){
    start = Date.now()

    notes.forEach((note, i) => {
        if(note.object.position.y < 0){
            if(notes[notes.length - 1].object.position.y < 60){
                startSetUp(false)
            }
            note.remove()
            notes.splice(i, 1)
        }
        note.moveDown(20/frameRate)
    })

    renderer.render(scene, camera)

    const elapsed = Date.now() - start
    console.log(`now: ${Date.now()} start: ${start} elapsed: ${elapsed}`)
    if(elapsed > 1000/frameRate){
        requestAnimationFrame(render2)
        // console.log(elapsed)
    } else {
        setTimeout(requestAnimationFrame, 1000/frameRate - elapsed, render2)
        // requestAnimationFrame(render2)
    }
}