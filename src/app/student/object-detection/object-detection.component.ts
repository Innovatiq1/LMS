import { Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { FaceMatchService } from '@core/service/face-match.service';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

@Component({
  selector: 'app-object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss'],
})
export class ObjectDetectionComponent {
  @Input() profilePic: string = '';

  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  detectionInterval: any;
  isMobilePhoneAlerted: boolean = false;
  isProhibitedObjectAlerted: boolean = false;
  isMultipleFaceAlerted: boolean = false;
  isLookingAwayAlert: boolean = false;
  captureInterval: any;

  livenessTimer: any;
  livenessCheckStarted: boolean = false;


  @Output() MobilePhone = new EventEmitter<void>();
  @Output() ProhibitedObject = new EventEmitter<void>();
  @Output() FaceNotVisible = new EventEmitter<void>();
  @Output() MultipleFacesVisible = new EventEmitter<void>();
  @Output() FaceMatchDetect = new EventEmitter<void>();
  @Output() FaceMisMatchDetect = new EventEmitter<void>();
  @Output() FaceMatchError = new EventEmitter<void>();
  @Output() FaceMatchMsg = new EventEmitter<string>();
  @Output() LookAway = new EventEmitter<void>();

  count: number = 0;
  isPendingFaceMatch: boolean = false;
  previousPosition: any = {};
  isLivePerson: boolean = false;
  isFaceMatched: boolean = false;

  private cocoModel: cocoSsd.ObjectDetection | null = null;
  private posenetModel: posenet.PoseNet | null = null;

  constructor(private faceMatchService: FaceMatchService) { }
  async ngOnInit() {
    await this.initializeModels();
    await this.startVideoStream();
  }

  async initializeModels(): Promise<void> {
    this.cocoModel = await cocoSsd.load();
    this.posenetModel = await posenet.load({
      architecture: 'MobileNetV1', // Faster than ResNet
      inputResolution: { width: 640, height: 480 },
      outputStride: 16
    });
  }

  async detectLiveness(pose: any) {
    if (this.isLivePerson) return;


    const keypoints = ['nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'leftShoulder', 'rightShoulder'];
    let totalMovement = 0;

    keypoints.forEach((part) => {
      const keypoint = pose.keypoints.find((kp: any) => kp.part === part);
      if (keypoint && keypoint.score > 0.5) {
        if (this.previousPosition[part]) {
          const dx = Math.abs(keypoint.position.x - this.previousPosition[part].x);
          const dy = Math.abs(keypoint.position.y - this.previousPosition[part].y);
          totalMovement += dx + dy;
        }
        this.previousPosition[part] = { x: keypoint.position.x, y: keypoint.position.y };
      }
    });

    // Define a threshold for natural movement (adjust based on testing)
    const minMovementThreshold = 10;  // Ignore micro-movements from shaking
    const maxShakeThreshold = 50;     // Ignore excessive fast movements

    if (totalMovement > minMovementThreshold && totalMovement < maxShakeThreshold) {
      this.isLivePerson = true;
    }

    if (!this.livenessCheckStarted) {
      this.livenessCheckStarted = true;
      this.isLivePerson = false;
      this.FaceMatchMsg.emit("Please move your head or body to continue.");
      this.livenessTimer = setTimeout(() => {
        if (this.isLivePerson) {
          console.log('Live person detected ✅');
          if (this.isLivePerson && this.isFaceMatched) {
            this.FaceMatchDetect.emit();
          }
        } else {
          console.log('Static photo detected ❌');
        }
        this.livenessCheckStarted = false;
      }, 10000);
    }
  }

  checkHeadTilt(pose: any) {
    const leftEar = pose.keypoints.find((kp: any) => kp.part === 'leftEar');
    const rightEar = pose.keypoints.find((kp: any) => kp.part === 'rightEar');

    if (!leftEar || !rightEar || leftEar.score < 0.5 || rightEar.score < 0.5) return false;

    const tiltAngle = Math.abs(leftEar.position.y - rightEar.position.y);

    if (tiltAngle > 10) {  // Adjust threshold as needed
      console.log('Head tilt detected');
      return true;
    }

    return false;
  }

  checkBodyMovement(pose: any) {
    const leftShoulder = pose.keypoints.find((kp: any) => kp.part === 'leftShoulder');
    const rightShoulder = pose.keypoints.find((kp: any) => kp.part === 'rightShoulder');

    if (!leftShoulder || !rightShoulder || leftShoulder.score < 0.5 || rightShoulder.score < 0.5) return false;

    const movement = Math.abs(leftShoulder.position.y - rightShoulder.position.y);

    if (movement > 5) {  // Adjust threshold based on testing
      console.log('Body movement detected');
      return true;
    }

    return false;
  }

  checkHeadMovement(pose: any) {
    const nose = pose.keypoints.find((kp: any) => kp.part === 'nose');

    if (!nose || nose.score < 0.5) return false; // Ensure nose is detected

    if (this.previousPosition) {
      const dx = Math.abs(nose.position.x - this.previousPosition.x);
      const dy = Math.abs(nose.position.y - this.previousPosition.y);

      if (dx > 5 || dy > 5) {
        console.log('Head movement detected');
        return true;
      }
    }

    this.previousPosition = { x: nose.position.x, y: nose.position.y };
    return false;
  }



  async startVideoStream() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        this.FaceMatchMsg.emit("Processing... Keep looking at the camera.");
        setTimeout(() => {
          this.detectFace(video, canvas);
        }, 2000);
        this.captureAutoFaceMatch(video, canvas);
        return;
      })
  }

  captureAutoFaceMatch(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.captureInterval = setInterval(() => {
      this.detectFace(video, canvas)
    }, 5000);
  }

  // Detect face and match with given image URL
  async detectFace(video: HTMLVideoElement, canvas: HTMLCanvasElement) {

    if (this.isPendingFaceMatch) {
      return;
    }
    this.FaceMatchMsg.emit("Capturing image...");
    this.isPendingFaceMatch = true;
    const context = canvas.getContext('2d');
    if (context) {
      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          // Send the Blob to the backend
          this.sendImageToBackend(blob);
        } else {
          console.error('Failed to create image blob.');
          this.isPendingFaceMatch = false;

        }
      }, 'image/png');

    }
  }

  sendImageToBackend(imageBlob: Blob) {
    this.FaceMatchMsg.emit("Face comparison in progress. Please wait...");
    this.isPendingFaceMatch = true;
    const formData = new FormData();
    formData.append('profileImage', imageBlob, 'captured-image.png'); // Append the Blob with a file name
    formData.append('imageUrl', this.profilePic);

    this.faceMatchService.checkFaceMatch(formData).subscribe({
      next: (res) => {
        this.isPendingFaceMatch = false;
        if (res.data.isMatch) {
          this.isFaceMatched = true;
          clearInterval(this.captureInterval);
          // this.FaceMatchDetect.emit();
          const video = this.videoElement.nativeElement;
          const canvas = this.canvasElement.nativeElement;
          this.detectObjects(video, canvas);
        } else {
          this.FaceMisMatchDetect.emit();
        }
      },
      error: (error) => {
        console.error(error);
        clearInterval(this.captureInterval);
        this.FaceMatchError.emit();
        this.isPendingFaceMatch = false;
      }
    })
  }

  async detectObjects(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    video.onloadedmetadata = async () => {
      this.startDetection();
    };

    if (video.readyState >= 2) { // ReadyState 2 = "HAVE_CURRENT_DATA"
      this.startDetection();
    } else {
      console.warn('Waiting for video to load...');
    }
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }



  startDetection(
  ): void {
    const video = this.videoElement.nativeElement;

    const detectFrame = async () => {
      if (this.cocoModel && this.posenetModel) {
        const objectPredictions = await this.cocoModel.detect(video);
        this.processPredictions(objectPredictions);

        const posePredictions = await this.posenetModel.estimateSinglePose(video, { flipHorizontal: true });
        this.detectLookingAway(posePredictions);
        this.detectLiveness(posePredictions);
      }

      requestAnimationFrame(detectFrame);
    };
    detectFrame();
  }

  detectLookingAway(pose: posenet.Pose): void {
    if (!this.isLivePerson) return;
    if (!pose || !pose.keypoints) return;
    const keypoints = pose.keypoints;
    const nose = keypoints.find((point) => point.part === 'nose');
    const leftEye = keypoints.find((point) => point.part === 'leftEye');
    const rightEye = keypoints.find((point) => point.part === 'rightEye');
    const leftShoulder = keypoints.find((point) => point.part === 'leftShoulder');
    const rightShoulder = keypoints.find((point) => point.part === 'rightShoulder');

    // if (nose && leftEye && rightEye && leftShoulder && rightShoulder) {
    //   // Calculate horizontal distance between eyes
    //   const eyeDistance = Math.abs(leftEye.position.x - rightEye.position.x);

    //   // Calculate the offset of the nose from the midpoint of the eyes
    //   const eyeMidpointX = (leftEye.position.x + rightEye.position.x) / 2;
    //   const noseOffset = Math.abs(nose.position.x - eyeMidpointX);

    //   const eyeMidpointY = (leftEye.position.y + rightEye.position.y) / 2;
    //   const noseEyeDistanceY = eyeMidpointY - nose.position.y;
    //   const shoulderMidpointY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
    //   const noseShoulderDistanceY = shoulderMidpointY - nose.position.y;

    //   const faceTurnThreshold = eyeDistance * 0.5; // Looking away sensitivity
    //   const tiltThreshold = 10; // Looking down sensitivity

    //   const isLookingAwayAlert = noseOffset > faceTurnThreshold;
    //   const isLookingDown = noseEyeDistanceY < tiltThreshold && noseShoulderDistanceY < 30;

    //   if (isLookingAwayAlert || isLookingDown) {
    //     if (!this.isLookingAwayAlert) {
    //       this.isLookingAwayAlert = true;
    //       console.log(isLookingAwayAlert ? 'Looking Away!' : 'Looking Down!')
    //       this.LookAway.emit();
    //       setTimeout(() => {
    //         this.isLookingAwayAlert = false;
    //       }, 5000);
    //     }
    //   }
    // }

    if (nose && leftEye && rightEye) {
      // Calculate horizontal movement of the nose
      const eyeCenterX = (leftEye.position.x + rightEye.position.x) / 2;
      const noseOffsetX = Math.abs(nose.position.x - eyeCenterX);

      // Calculate vertical movement of the nose
      const eyeCenterY = (leftEye.position.y + rightEye.position.y) / 2;
      const noseOffsetY = Math.abs(nose.position.y - eyeCenterY);

      // Define thresholds for looking away
      const horizontalThreshold = 15; // Side-to-side movement
      const verticalThreshold = 25;   // Up/down movement

      if (noseOffsetX > horizontalThreshold || noseOffsetY > verticalThreshold) {

        if (!this.isLookingAwayAlert) {
          this.isLookingAwayAlert = true;
          console.log("Looking Away ❌");
          this.LookAway.emit();
          setTimeout(() => {
            this.isLookingAwayAlert = false;
          }, 5000);
        } else {
          this.isLookingAwayAlert = false;
        }
      }

    }
  }

  processPredictions(predictions: cocoSsd.DetectedObject[]): void {
    if (!this.isLivePerson) return;
    if (predictions.length === 0) {
      if (this.count >= 50) {
        this.FaceNotVisible.emit();
        this.count = 0;
      } else {
        this.count++;
      }
    }

    let faces = 0;

    predictions.forEach((prediction) => {
      if (prediction.class === 'person') faces++;
      if (
        ['book', 'laptop', 'cell phone'].includes(prediction.class) &&
        !this.isProhibitedObjectAlerted
      ) {
        this.isProhibitedObjectAlerted = true;
        this.ProhibitedObject.emit();
        setTimeout(() => (this.isProhibitedObjectAlerted = false), 2000); // Reset after 2 seconds
      }
    });

    if (faces > 1 && !this.isMultipleFaceAlerted) {
      this.isMultipleFaceAlerted = true;
      this.MultipleFacesVisible.emit();
      setTimeout(() => (this.isMultipleFaceAlerted = false), 2000);
    }
  }

  cleanupResources(): void {
    const video = this.videoElement.nativeElement;
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }

}