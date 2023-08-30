import * as PIANO from '../js/piano.js'
import * as NOTE from '../js/notes.js'

let midiBuffer;
let midiDataView;
let midiArray;

document.getElementById("midiUpload").onsubmit = async function(event){
    event.preventDefault()
    let fileInput = document.getElementById("upload");
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        // binary data
        console.log(e.target);
        // let hexString = arrayBufferToHexString(e.target.result);
        const buffer = e.target.result
        midiBuffer = buffer
        midiDataView = new DataView(buffer) // way to interact with binary data
        midiArray = new Uint8Array(buffer) // typed array with an array of bytes
        // playMidi(buffer)
    };
    reader.onerror = function(e) {
        // error occurred
        console.log('Error : ' + e.type);
    };
    reader.readAsArrayBuffer(file);
}

let channel = 0;
export let delay = 0;
export let delay2 = 0;
export let tempo = 270000;
export let temp = () => {return tempo/1000}
export let divs = 480

export function getTimeDelay() {
    const beats = delay/480
    return beats * tempo/1000
}

export function getTimeDelayAfter() {
    const beats = delay2/480
    return beats * tempo/1000
}

// export function getTickDelay() {
//     const beats = delay/480
//     return beats * tempo/1000
// }

document.getElementById("buttone2").addEventListener('click', playMid)
document.getElementById("buttone3").addEventListener('click', getTimeDelay)

function playMid(){
    // playMidi(midiBuffer)
    // renderLoop(PIANO.render)
    PIANO.render()
}


// testing function for reading binary data
function playMidi(buffer){
    const view = new DataView(buffer) // way to interact with binary data
    const data = new Uint8Array(buffer) // typed array with an array of bytes
    const headerText = view.getUint32(0, false)
    if(headerText !== 1297377380){ // checks if the first 4 bytes are a u32int representation of MThd
        alert("Invalid MIDI file")
        return
    }
    const format = view.getUint16(8, false) // format is either 0, 1, or 2
    const numTracks = view.getUint16(10, false) // number of MTrks in the file
    const rawDivisions = view.getUint16(12, false) // used for tempo
    let givenPosition = 18; // skips the header chunk

    let tracksPos = [22]

    {
        // gets the position of where the different tracks start to play them simultaneously
        let i = 18
        while(i < buffer.byteLength){
            i += view.getUint32(i, false) + 8
            tracksPos.push(i)
        }
    }
    tracksPos.pop()

    console.log(tracksPos)

    // for(let i = 0; i < numTracks; i++){
    for(let i = 0; i < 1; i++){
        const length = view.getUint32(givenPosition, false) // length in bytes of the MTrk chunk (after the length itself)
        console.log("length: " + length)
        givenPosition += 4 // skips over the bytes describing the length
        var j = givenPosition
        // while(j < length + givenPosition - 3){ // last three bytes are supposed to signal the end of the track
        let eventType;
        while(j < 500){ // last three bytes are supposed to signal the end of the track

            const getDelay = getVariableLength(j, data)
            delay = getDelay.delay // delay can be multiple bytes
            if(delay < 1000){
                requestAnimationFrame(PIANO.render)
                // PIANO.render()
            }

            j = getDelay.index
            console.log(`delay: ${delay} ; j: ${j.toString(16)}`)
            const dataByte1 = data[j]
            j++

            if(dataByte1 === 0xff) {
                // meta events
                if(data[j] === 0x51){
                    // tempo event
                    const byte1 = data[j + 2] << 16
                    const byte2 = data[j + 3] << 8
                    const byte3 = data[j + 4] 
                    tempo = byte1 | byte2 | byte3 // tempo is in 3 bytes
                    console.log(`TEMPO: ${tempo}`)
                }
                j++
                const length = data[j] // length of meta event
                j++
                console.log("Meta Event with length " + length)
                j += length
                continue;
            }
            if(dataByte1 & 0x80){
                // data byte
                eventType = (dataByte1 >> 4) - 8 // first 4 bits are the event type (first bit is always a 1)
                channel = dataByte1 & 0xf // last 4 bits are channel
            } else {
                j--;
            }
            // running status means that we don't have to update event type if its the same
            console.log("event type " + eventType)
            console.log("channel "+ channel)
            const availableChannels = [0, 1, 2, 3, 4, 5, 6]
            let validEvent = false
            availableChannels.forEach((el) => {
                if(el == eventType){
                    validEvent = true
                }
            })
            if(validEvent){
                channelEventTypes[eventType].function(j, data)
                j += channelEventTypes[eventType].indexToAdd
            } else {
                j++
            }
            // requestAnimationFrame(PIANO.render)
            // PIANO.render()
        }
        givenPosition += length + 4 // adds the end of the data plus the bytes for 'MTrk'
        // requestAnimationFrame(PIANO.render2)
    }
}

export function renderLoop(j){
    let eventType;
    const getDelay = getVariableLength(j, midiArray)
    delay = getDelay.delay // delay can be multiple bytes

    j = getDelay.index
    const dataByte1 = midiArray[j]
    j++

    if(dataByte1 === 0xff) {
        // meta events
        if(midiArray[j] === 0x51){
            // tempo event
            const byte1 = midiArray[j + 2] << 16
            const byte2 = midiArray[j + 3] << 8
            const byte3 = midiArray[j + 4] 
            tempo = byte1 | byte2 | byte3 // tempo is in 3 bytes
            console.log(`TEMPO: ${tempo}`)
        }
        j++
        const length = midiArray[j] // length of meta event
        j++
        console.log("Meta Event with length " + length)
        j += length
    } else if(dataByte1 & 0x80){
        // data byte
        eventType = (dataByte1 >> 4) - 8 // first 4 bits are the event type (first bit is always a 1)
        channel = dataByte1 & 0xf // last 4 bits are channel
    } else {
        j--; // subtracts in case of running status so that the counter lines up
    }
    // running status means that we don't have to update event type if its the same
    const availableChannels = [0, 1, 2, 3, 4, 5, 6]
    let validEvent = false
    availableChannels.forEach((el) => {
        if(el == eventType){
            validEvent = true
        }
    })
    if(validEvent){
        channelEventTypes[eventType].function(j, midiArray)
        j += channelEventTypes[eventType].indexToAdd
    } else {
        j++
    }
    delay2 = getVariableLength(j, midiArray).delay
    return j
}

export function renderLoop2(j){
    let eventType;
    const dataByte1 = midiArray[j]
    j++

    if(dataByte1 === 0xff) {
        // meta events
        if(midiArray[j] === 0x51){
            // tempo event
            const byte1 = midiArray[j + 2] << 16
            const byte2 = midiArray[j + 3] << 8
            const byte3 = midiArray[j + 4] 
            tempo = byte1 | byte2 | byte3 // tempo is in 3 bytes
            console.log(`TEMPO: ${tempo}`)
        }
        j++
        const length = midiArray[j] // length of meta event
        j++
        console.log("Meta Event with length " + length)
        j += length
    } else if(dataByte1 & 0x80){
        // data byte
        eventType = (dataByte1 >> 4) - 8 // first 4 bits are the event type (first bit is always a 1)
        channel = dataByte1 & 0xf // last 4 bits are channel
    } else {
        j--;
    }
    // running status means that we don't have to update event type if its the same
    console.log("event type " + eventType)
    console.log("channel "+ channel)
    const availableChannels = [0, 1, 2, 3, 4, 5, 6]
    let validEvent = false
    availableChannels.forEach((el) => {
        if(el == eventType){
            validEvent = true
        }
    })
    if(validEvent){
        channelEventTypes[eventType].function(j, midiArray)
        j += channelEventTypes[eventType].indexToAdd
    } else {
        j++
    }

    const getDelay = getVariableLength(j, midiArray)
    delay = getDelay.delay // delay can be multiple bytes

    j = getDelay.index
    console.log(`delay: ${delay} ; j: ${j.toString(16)}`)
    // requestAnimationFrame(PIANO.render)
    // PIANO.render()
    return j
}

// code snippet adapted from http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html
function getVariableLength(startIndex, data){
    let index = startIndex
    let delay = data[index]
    index++
    if(delay & 0x80){
        let byte;
        delay &= 0x7f // only first 7 bits are data
        do{
            byte = data[index]
            delay = ((delay << 7) + (byte & 0x7f)) // shifts the data and adds the next 7 bits
            index++
        } while (byte & 0x80) // last byte starts with bit 0
    }
    return {delay: delay, index: index}
}

function noteOff(j, data){
    // runs after a note off event
    const note = data[j]
    PIANO.notes.forEach((keyboardNote, i) => {
        if(keyboardNote.note === note){
            PIANO.notes[i].on = false
            // PIANO.notes.splice(i, 1)
        }
    })
    // console.log(`Note OFF: ${getNote(data[j])} num: ${data[j]}`)
    // console.log(`Velocity: ${data[j + 1]}`)
    // console.log("j " + j.toString(16))
}

function noteOn(j, data){
    // runs after a note on event
    const note = data[j]
    PIANO.notes.push(new NOTE.note(note, 0, j))
    // console.log(`Note ON: ${getNote(data[j])} num: ${data[j]}`)
    // console.log(`Velocity: ${data[j + 1]}`)
    // console.log("j " + j.toString(16))
}

function doNothing(){
    // does nothing
}

// indexToAdd is the size of the event to skip in the runner
// function is what happens during the event
const channelEventTypes = {
    0: {indexToAdd: 2, function: noteOff},
    1: {indexToAdd: 2, function: noteOn},
    2: {indexToAdd: 2, function: doNothing}, // Polyphonic Key Pressure (Aftertouch).
    3: {indexToAdd: 2, function: doNothing}, // Control Change.
    4: {indexToAdd: 1, function: doNothing}, // Program Change.
    5: {indexToAdd: 1, function: doNothing}, // Channel Pressure (After-touch).
    6: {indexToAdd: 2, function: doNothing}, // Pitch Wheel Change.
}

// const notes = { // midi index for each note (ignores octaves)
//     0: "C",
//     1: "C#",
//     2: "D",
//     3: "D#",
//     4: "E",
//     5: "F",
//     6: "F#",
//     7: "G",
//     8: "G#",
//     9: "A",
//     10: "A#",
//     11: "B",
// }

// function getNote(number){
//     const noteObj = {octave: Math.floor(number / 12) - 1, note: notes[number % 12]}
//     return `${noteObj.note}${noteObj.octave}`
// }