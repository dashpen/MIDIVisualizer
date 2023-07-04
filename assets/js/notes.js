import * as THREE from 'three';
import {noteMaterial} from '../js/piano.js'
import {scene} from '../js/piano.js'

export class note {
    note;
    track;
    object;

    constructor(note, track){
        this.note = note
        this.track = track
    }

    generateObject(){
        const box = new THREE.BoxGeometry(1, 2, 1)
        this.object = new THREE.Mesh(box, noteMaterial)
        this.object.position.x = note * 2 + 1
        this.object.position.y = 10
        scene.add(this.object)
    }

    moveDown(){
        this.object.position.y -= 0.1
    }
}