document.getElementById("midiUpload").onsubmit = async function(event){
    event.preventDefault()
    let fileInput = document.getElementById("upload");
    let file = fileInput.files[0];
    content = await file
    let reader = new FileReader();
    reader.onload = function(e) {
        // binary data
        console.log(e.target);
        let hexString = arrayBufferToHexString(e.target.result);
        const buffer = e.target.result
        // for (let i = 0; i < binaryData.length; i++) {
        //     const binaryChar = binaryData.charCodeAt(i).toString(2);
        //     console.log(binaryChar.padStart(8, "0")); // Print each character as binary
        // }
        // for (let i = 0; i < binaryData.length; i++) {
        //     const binaryChar = binaryData.charCodeAt(i).toString(16);
        //     hexString += binaryChar.padStart(2, "0");
        // }
        // console.log(hexString)
        const tempStr = hexString.split("");
        for (let i = 0; i < buffer.byteLength; i++) {
            if((tempStr[i] == "4") && (tempStr[i+1] == "d") && (tempStr[i+2] == "5") && (tempStr[i+3] == "4")){
                console.log("MT at " + i)
            }
        }
        playMidi(e)
    };
    reader.onerror = function(e) {
        // error occurred
        console.log('Error : ' + e.type);
    };
    reader.readAsArrayBuffer(file);
}
function arrayBufferToHexString(buffer) {
    const uint8Array = new Uint8Array(buffer);
    let hexString = '';
  
    for (let i = 0; i < uint8Array.length; i++) {
      const hexValue = uint8Array[i].toString(16).padStart(2, '0');
      hexString += hexValue;
    }
  
    return hexString;
  }

function playMidi(e){
    const buffer = e.target.result // binary data
    const view = new DataView(buffer) // way to interact with binary data
    const headerText = view.getUint32(0, false)
    if(headerText !== 1297377380){ // checks if the first 4 bytes are a u32int representation of MThd
        alert("Invalid MIDI file")
        return
    }
    const format = view.getUint16(8, false) // format is either 0, 1, or 2
    const numTracks = view.getUint16(10, false) // number of MTrks in the file
    const rawDivisions = view.getUint16(12, false)
    let givenPosition = 18; // skips the header chunk

    // for(let i = 0; i < numTracks; i++){
    for(let i = 0; i < 1; i++){
        const length = view.getUint32(givenPosition, false) // length in bytes of the MTrk chunk (after the length itself)
        console.log("length: " + length)
        givenPosition += 4 // skips over the bytes describing the length
        // let midiTrack = [] // stores midi events for the current track
        let j = givenPosition
        // while(j < length + givenPosition - 3){ // last three bytes are supposed to signal the end of the track
        while(j < 500){ // last three bytes are supposed to signal the end of the track
            // console.log("position:" + (curPos))

            const delay = view.getUint8(j, false) // first 1 byte of an event are supposed to be a delay
            const dataByte1 = view.getUint8(j + 1, false)
            // console.log("delay " + delay.toString(16))
            // console.log("current value "+ dataByte1.toString(16))
            // console.log("j " + j)
            // console.log(`J :${j} delay:${delay}`)
            // console.log("dataByte1: " + dataByte1)
            if(dataByte1 === 255) {
                // meta events (ignoring for now)
                const length = view.getUint8(j + 3, false) // length of meta event
                console.log("Meta Event with length "+ length)
                j += (length === 0 ? 2 : length + 4)
                continue;
            }
            if(dataByte1 > 127){
                // data byte
                const eventType = dataByte1 >> 4
                console.log("event type " + eventType)
                const channel = dataByte1 & 0xf // last 4 bits are channel
                console.log("channel "+ channel)
                switch (eventType) {
                    case 8:
                        // note off event
                        console.log(`Note OFF: ${getNote(view.getUint8(j + 2, false)).note}`)
                        console.log(`Velocity: ${view.getUint8(j + 3, false)}`)
                        console.log("j " + j)
                        j += 4
                        continue;
                    case 9:
                        // note on event
                        console.log(`Note ON: ${getNote(view.getUint8(j + 2, false)).note}`)
                        console.log(`Velocity: ${view.getUint8(j + 3, false)}`)
                        console.log("j " + j)
                        j += 4
                        continue;
                    case 12:
                        // program change event
                        const programChange = view.getUint8(j + 2, false)
                        console.log(programChange === 0 ? "Grand Piano" : "Not piano")
                        j += 3
                        console.log("j " + j)
                        continue;
                    default:
                        break;
                }
            }
            // console.log(firstBytes)
            // console.log("didn't work " + dataByte1.toString(16))
            // console.log("didn't work j " + j)
            j++
        }
        givenPosition += length + 4
    }
}

const notes = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B",
}

function getNote(number){
    return {octave: number % 12 - 1, note: notes[number % 12]}
}

function playMidiLaterFunction(e){
    const buffer = e.target.result
    const view = new DataView(buffer)
    // getting header values
    const headerText = view.getUint32(0, false)
    if(headerText !== 1297377380){ // checks if the first 4 bytes are a u32int representation of MThd
        alert("Invalid MIDI file")
        return
    }
    const format = view.getUint16(8, false) // format is either 0, 1, or 2
    const numTracks = view.getUint16(10, false) // number of MTrks in the file
    const rawDivisions = view.getUint16(12, false)
    let timeFormat = 0;
    let ticksPerQuarterNote = 0;
    if(rawDivisions < 32768){ // means its a 'ticks per quarter-note' format
        ticksPerQuarterNote = rawDivisions;
        timeFormat = 0;
    } else {
        // work in progress for the other format
    }
    /*
    COME
    BACK
    TO 
    THIS 
    LATER
    PLEASE
    DON'T
    FORGET
    !!!
    */

    let givenPosition = 18;

    // var midiEvents = new Array(numTracks)
    var midiEvents = []

    const metaEventObject = {
        0: () => {console.log("HI!")}
    }

    console.log(numTracks)
    // main loop for midi tracks
    for(let i = 0; i < numTracks; i++){
        const length = view.getUint32(givenPosition, false) // length in bytes of the MTrk chunk (after the length itself)
        console.log("length: " + length)
        givenPosition += 4 // skips over the bytes describing the length
        let midiTrack = [] // stores midi events for the current track
        let j = givenPosition
        while(j < length + givenPosition - 3){ // last three bytes are supposed to signal the end of the track
            // console.log("position:" + (curPos))
            const delay = view.getUint8(j, false) // first 2 bytes of an event are supposed to be a delay
            const dataByte1 = view.getUint8(j + 2, false)
            // console.log(`J :${j} delay:${delay}`)
            // console.log("dataByte1: " + dataByte1)
            if(dataByte1 === 255) { // check for meta-events
                const dataByte2 = view.getUint8(j + 4, false)
                let metaEventObj = {
                    delay: delay,
                    type: "",
                    text: ""
                }
                if(dataByte2 < 8){
                    const textLength = view.getUint8(j + 6, false)
                    const text = new Int8Array(buffer, j + 8, textLength) // gets text as an array of ints to be processed later
                    metaEventObj.text = text
                    j += 8 + textLength
                }
                switch (dataByte2) {
                    case 0:
                        // sequence number
                        j++
                        break;
                    case 1:
                        metaEventObj.type = "text"
                        break;
                    case 2: // basically the same as a text event
                        metaEventObj.type = "copyright"
                        break;
                    case 3:
                        let trackTitleObjType = ""
                        if(format === 0 || (i === 0 && format === 1)){
                            trackTitleObjType = "Squence Name"
                        } else {
                            trackTitleObjType = "Track Name"
                        }
                        metaEventObj.type = trackTitleObjType
                        break;
                    case 4:
                        metaEventObj.type = "instrument name"
                        break;
                    case 5:
                        metaEventObj.type = "lyric"
                        break;
                    case 6:
                        metaEventObj.type = "marker"
                        break;
                    case 7: 
                        metaEventObj.type = "cue"
                        break;
                    case 8:
                        const channelPrefixChannel = view.getUint8(j + 6, false)
                        metaEventObj.text = channelPrefixChannel
                        metaEventObj.type = "channel prefix"
                        j += 6;
                        break;
                    case 81:
                        const tempTempo = view.getUint32(j + 4, false) - 50331648
                        metaEventObj.type = "tempo"
                        metaEventObj.text = tempTempo
                    case 47:
                        // end of track
                        console.log("END OF TRACK")
                        j = length + givenPosition;
                        break;
                    default:
                        j++
                        break;
                }
                midiTrack.push(midiEventObj) // adds midi event to the array
            }
            // console.log(firstBytes)
            j++
        }
        midiEvents.push(midiTrack)
        console.log(midiEvents)
        console.log("length: " + length)
        console.log("GivenPosition: " + givenPosition)

        givenPosition += length + 4
    }




    // console.log(format, numTracks)
    // const headerOffset = view.getUint32(4, false)
    // console.log(view.getUint32(headerOffset + 4 + 4, false))
    // const firstOffset = view.getUint32(headerOffset + 12, false)
    // console.log(firstOffset)
    // const secondOffset = view.getUint32(headerOffset + 20 + firstOffset, false)
    // console.log(secondOffset)
    // const thirdOffset = view.getUint32(headerOffset + 28 + firstOffset + secondOffset, false)
    // console.log(thirdOffset)
    // document.getElementById("textField").innerHTML = hexString
}