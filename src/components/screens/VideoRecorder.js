// import React, { Component } from 'react'
// import * as tf from '@tensorflow/tfjs'
// const recordingTimeMS = 5000
// const style = {
//     form: {
//         margin: '10px',
//         padding: '5vw'
//     },
//     logo: {
//         marginTop: '25px',
//         // boxShadow: '2px 2px black'
//     },
//     page: {
//         marginTop: '100px',
//         padding: '10vw'
//     }
// }

// class VideoRecorder extends Component {

//     state = {
//         isMobile: true
//     }

//     startVideo = () => {
//         window.mobilecheck = function() {
//             var check = false;
//             (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
//             this.setState({isMobile: check})
//             return check;
//           }
//         if(this.state.isMobile){
//             navigator.mediaDevices.getUserMedia({
//                video: { facingMode: { exact: "environment" } },
//             }).then(stream => {
//                 this.refs.preview.srcObject = stream;
//             })
//         } else {
//             navigator.mediaDevices.getUserMedia({
//                 video: true,
//              }).then(stream => {
//                  this.refs.preview.srcObject = stream;
//              })
//         }
//     }

//     componentDidMount(){
//         this.startVideo()
//     }

//     log = (msg) => {
//         this.refs.logElement.innerHTML += msg + "\n";
//     }

//     wait = (delayInMS) => {
//         return new Promise(resolve => setTimeout(resolve, delayInMS));
//     }

//     startRecording = (stream, lengthInMS) => {
//         let recorder = new MediaRecorder(stream);
//         let data = [];

//         recorder.ondataavailable = event => data.push(event.data);
//         recorder.start();
//         this.log(recorder.state + " for " + (lengthInMS / 1000) + " seconds...");

//         let stopped = new Promise((resolve, reject) => {
//             recorder.onstop = resolve;
//             recorder.onerror = event => reject(event.name);
//         });

//         let recorded = this.wait(lengthInMS).then(
//             () => recorder.state == "recording" && recorder.stop()
//         );

//         return Promise.all([
//             stopped,
//             recorded
//         ])
//             .then(() => data);
//     }

//     stop = (e) => {
//         this.refs.preview.srcObject.getTracks().forEach(track => track.stop());
//     }

//     startButton = (e) => {
//         const preview = this.refs.preview
//         // const webcamImage = tf.fromPixels(preview)
//         // const croppedImage = 1
//         const downloadButton = this.refs.downloadButton
//         const recording = this.refs.recording
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//         }).then(stream => {
//             preview.srcObject = stream;
//             downloadButton.href = stream;
//             preview.captureStream = preview.captureStream || preview.mozCaptureStream;
//             return new Promise(resolve => preview.onplaying = resolve);
//         }).then(() => this.startRecording(preview.captureStream(), recordingTimeMS))
//             .then(recordedChunks => {
//                 let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
//                 recording.src = URL.createObjectURL(recordedBlob);
//                 downloadButton.href = recording.src;
//                 downloadButton.download = "RecordedVideo.webm";

//                 this.log("Successfully recorded " + recordedBlob.size + " bytes of " +
//                     recordedBlob.type + " media.");
//             })
//             .catch(this.log);
//     }

//     render() {
//         return (
//             <div style={style.page}>
//                 <video ref="preview" width="160" height="120" autoPlay muted></video>
//                 <button onClick={this.startButton}>Start</button>
//                 <button onClick={this.stop}>Stop</button>
//                 <video ref="recording" width="160" height="120" controls></video>
//                 <button ref='downloadButton'>Download</button>
//                 <p ref='logElement' style={{ color: 'white' }}></p>
//             </div>
//         )
//     }
// }
// export default VideoRecorder

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs';

/**
 * A class that wraps webcam video elements to capture Tensor4Ds.
 */
export class VideoRecorder {
  /**
   * @param {HTMLVideoElement} webcamElement A HTMLVideoElement representing the webcam feed.
   */
  constructor(webcamElement) {
    this.webcamElement = webcamElement;
  }

  /**
   * Captures a frame from the webcam and normalizes it between -1 and 1.
   * Returns a batched image (1-element batch) of shape [1, w, h, c].
   */
  capture() {
    return tf.tidy(() => {
      // Reads the image as a Tensor from the webcam <video> element.
      const webcamImage = tf.fromPixels(this.webcamElement);

      // Crop the image so we're using the center square of the rectangular
      // webcam.
      const croppedImage = this.cropImage(webcamImage);

      // Expand the outer most dimension so we have a batch size of 1.
      const batchedImage = croppedImage.expandDims(0);

      // Normalize the image between -1 and 1. The image comes in between 0-255,
      // so we divide by 127 and subtract 1.
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }

  /**
   * Crops an image tensor so we get a square image with no white space.
   * @param {Tensor4D} img An input image Tensor to crop.
   */
  cropImage(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  /**
   * Adjusts the video size so we can make a centered square crop without
   * including whitespace.
   * @param {number} width The real width of the video element.
   * @param {number} height The real height of the video element.
   */
  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  async setup() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
            {video: true},
            stream => {
            //   this.webcamElement.srcObject = stream;
            console.log(this.webcamElement)
              this.webcamElement.addEventListener('loadeddata', async () => {
                this.adjustVideoSize(
                    this.webcamElement.videoWidth,
                    this.webcamElement.videoHeight);
                resolve();
              }, false);
            },
            error => {
              reject();
            });
      } else {
        reject();
      }
    });
  }
}

