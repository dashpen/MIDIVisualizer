import * as THREE from 'three';
import {noteMaterial} from '../js/piano.js'
import {scene} from '../js/piano.js'
import {cameraHeight as height} from '../js/piano.js'

const scaleVec = new THREE.Vector3(1, 1, 1)


export class note {
    note;
    track;
    object;

    constructor(note, track){
        this.note = note
        this.track = track
    }

    generateObject(){
        const box = new THREE.PlaneGeometry(1, 2)
        this.object = new THREE.Mesh(box, noteMaterial)
        this.object.position.x = this.note * 2 + 1
        this.object.position.y = height - 3
        console.log(box.getAttribute('position'))
        console.log(this.object)
        scene.add(this.object)
    }

    turnOff(){
        
    }

    moveDown(){
        this.object.scale.y += 0.05
        this.object.position.y -= 0.05
    }
}