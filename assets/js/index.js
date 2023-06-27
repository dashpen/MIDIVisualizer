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
    console.log(format, numTracks)
    const headerOffset = view.getUint32(4, false)
    console.log(view.getUint32(headerOffset + 4 + 4, false))
    const firstOffset = view.getUint32(headerOffset + 12, false)
    console.log(firstOffset)
    const secondOffset = view.getUint32(headerOffset + 20 + firstOffset, false)
    console.log(secondOffset)
    const thirdOffset = view.getUint32(headerOffset + 28 + firstOffset + secondOffset, false)
    console.log(thirdOffset)
    document.getElementById("textField").innerHTML = hexString
}