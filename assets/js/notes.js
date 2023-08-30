import * as THREE from 'three';
import {noteMaterial} from '../js/piano.js'
import {scene} from '../js/piano.js'
import {cameraHeight as height} from '../js/piano.js'
import {notes as storedNotes} from '../js/piano.js'

const box = new THREE.PlaneGeometry(1, 1)


const scaleMat = new THREE.Matrix4()

export class note {
    note;
    track;
    object;
    on;
    length;
    j;

    constructor(note, track, j){
        const prevNote = storedNotes[storedNotes.length - 1]
        this.note = note
        this.track = track
        this.j = j
        this.on = true
        this.object = new THREE.Mesh(box, noteMaterial)
        this.object.position.x = (this.note - 60) * 2 + 1
        if(prevNote){
            this.object.position.y = prevNote.object.position.y
        } else {
            this.object.position.y = height
        }
        this.length = 0
        scene.add(this.object)
    }

    moveDown(amount){
        // console.log(`AMOUNT: ${amount}`)
        this.object.position.y -= amount
    }

    // extendOne(){
    //     this.object.scale.y += 0.01
    //     this.object.position.y -= 0.01
    // }

    /**
    * extends the note by inputted delay
    * @param {number} delay delay to extend the note by
    */
    extendByDelay(delay){
        const length = delay / 50
        this.length += length
        const geometry = new THREE.PlaneGeometry(1, this.length)
        this.object.geometry = geometry
        // this.object.scale.y *= length
        // this.object.translateY(length)
        this.object.position.y += length
        // scaleMat.set(
        //     1, 0, 0, 0,
        //     0, length, 0, 0,
        //     0, 0, 1, 0,
        //     0, 0, 0, 1)
        // this.object.applyMatrix4(scaleMat)
        // console.log("DELAY " + length)
    }
    
    remove(){
        // this.length = 
        scene.remove(this.object)
    }
}