const recordButton = document.querySelector(".record")
const stopButton = document.querySelector(".stop")
const watchButton = document.querySelector(".watch")
const downloadButton = document.querySelector(".download_btn")
const previewPlayer = document.querySelector("#preview")
const recordPlayer = document.querySelector("#recording")

const recordingDuration = 30;
let recorder;
let recordedChunks;

//functions
function videoStart(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream)=> {
            previewPlayer.srcObject = stream;
            startRecording(
                previewPlayer.captureStream() || previewPlayer.mozCaptureStream()
        );
    });
}


function startRecording(stream){
    recordedChunks= [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) =>{ recordedChunks.push(e.data)}
    recorder.start();
}
function stopRecording() {
    previewPlayer.srcObject.getTracks().forEach((track) => track.stop());
    recorder.stop();
}

function playRecording() {
    const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    recordPlayer.src = URL.createObjectURL(recordedBlob);
    recordPlayer.play();
    downloadButton.href = recordPlayer.src;
    downloadButton.download = `recording_${new Date()}.webm`;
    }

//event

recordButton.addEventListener("click", videoStart);
stopButton.addEventListener("click", stopRecording);
watchButton.addEventListener("click", playRecording);

/* button ui */
const buttons = document.querySelectorAll(".button-container > button");

function setActive() {
    const activeButton = document.querySelector(".active");
    if (activeButton) {
        activeButton.classList.remove("active");
    }
    this.classList.add("active");
}

buttons.forEach((button) => button.addEventListener("click", setActive));

/*video*/

const videoSrc = document.querySelector("#video-source");
const videoTag = document.querySelector("#video-tag");
const inputTag = document.querySelector("#input-tag");

inputTag.addEventListener('change',  readVideo)

function readVideo(event) {
  console.log(event.target.files)
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      console.log('loaded')
      videoSrc.src = e.target.result
      videoTag.load()
    }.bind(this)

    reader.readAsDataURL(event.target.files[0]);
  }
}