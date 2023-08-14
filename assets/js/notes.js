import * as THREE from 'three';
import {noteMaterial} from '../js/piano.js'
import {scene} from '../js/piano.js'
import {cameraHeight as height} from '../js/piano.js'

const box = new THREE.PlaneGeometry(1, 2)


export class note {
    note;
    track;
    object;
    on;
    length;

    constructor(note, track){
        this.note = note
        this.track = track
        this.on = true
        this.object = new THREE.Mesh(box, noteMaterial)
        this.object.position.x = (this.note - 60) * 2 + 1
        this.object.position.y = height
        this.length = 0
        scene.add(this.object)
    }

    moveDown(){
        this.object.position.y -= 0.2
    }

    extendOne(){
        this.object.scale.y += 0.01
        this.object.position.y -= 0.01
    }

    /**
    * extends the note by inputted delay
    * @param {number} delay delay to extend the note by
    */
    extendByDelay(delay){
        this.object.scale.y += 0.01 * delay
        this.object.position.y += 0.01 * delay
        this.length += delay
    }
    
    remove(){
        scene.remove(this.object)
    }
}