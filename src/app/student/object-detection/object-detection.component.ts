import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { AuthenService } from '@core/service/authen.service';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss'],
})
export class ObjectDetectionComponent {
  @Input() profilePic:string = '';
  @Input() profilePicDesc:Float32Array|null = null;

  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  detectionInterval: any;
  isMobilePhoneAlerted: boolean = false;
  isProhibitedObjectAlerted: boolean = false;
  isMultipleFaceAlerted: boolean = false;
  isFaceMatchAlerted: boolean = false;
  isFaceMisMatchAlerted: boolean = false;

  private givenFaceDescriptor:Float32Array|null = null;

  @Output() MobilePhone = new EventEmitter<void>();
  @Output() ProhibitedObject = new EventEmitter<void>();
  @Output() FaceNotVisible = new EventEmitter<void>();
  @Output() MultipleFacesVisible = new EventEmitter<void>();
  @Output() FaceMatchDetect = new EventEmitter<void>();
  @Output() FaceMisMatchDetect = new EventEmitter<void>();

  count: number = 0;

  faceMatchInterval:any;

  async ngOnInit(): Promise<void> {
    await this.loadModels();
    this.givenFaceDescriptor = this.profilePicDesc;
    this.initializeWebcam();
  }

  async generateFaceDescriptor(
    imagePath: string
  ): Promise<Float32Array | null> {
    try {
      const img = await faceapi.fetchImage(imagePath);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        console.error('No face detected in the profile picture.');
        return null;
      }
      return detection.descriptor;
    } catch (error) {
      console.error('Error generating face descriptor:', error);
      return null;
    }
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  initializeWebcam(): void {
    const video = this.videoElement.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        this.startFaceComparison(video);
        return cocoSsd.load();
      })
      .then((model) => this.startDetection(video, model))
      .catch(console.error);
  }

  async startFaceComparison(video: HTMLVideoElement): Promise<void> {
    if (!this.givenFaceDescriptor) {
      console.error('Given face descriptor is not available.');
      return;
    }

    this.faceMatchInterval = setInterval(async () => {
      if (!this.givenFaceDescriptor) {
        console.error('User profile face descriptor is not available.');
        return;
      }
      const detectedDescriptor = await this.detectFaceFromVideo(video);

      if (detectedDescriptor) {
        const isMatch = this.compareFaces(
          this.givenFaceDescriptor,
          detectedDescriptor
        );
        if (!isMatch && !this.isFaceMatchAlerted) {
          console.warn('Face does not match the given image.');
          this.FaceMisMatchDetect.emit();
          setTimeout(()=>(this.isFaceMatchAlerted = false),2000)
        }else {
          this.FaceMatchDetect.emit();
        }
      }
    }, 1000); // Compare every second
  }

  compareFaces(profilePicDescri:Float32Array,detectedDescri:Float32Array):boolean{
    const distance = faceapi.euclideanDistance(profilePicDescri, detectedDescri);
    return distance<0.6
  }

  startDetection(
    video: HTMLVideoElement,
    model: cocoSsd.ObjectDetection
  ): void {
    const detectFrame = () => {
      model.detect(video).then((predictions) => {
        this.processPredictions(predictions);
        requestAnimationFrame(detectFrame);
      });
    };
    detectFrame();
  }

  async detectFaceFromVideo(
    video: HTMLVideoElement
  ): Promise<Float32Array | null> {
    const detection = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn('No face detected in the video feed.');
      return null;
    }

    return detection.descriptor;
  }

  processPredictions(predictions: cocoSsd.DetectedObject[]): void {
    // const canvas = this.canvasElement.nativeElement;
    // const ctx = canvas.getContext('2d');
    // if (!ctx) {
    //   console.error('Canvas context not available');
    //   return;
    // }

    // // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // predictions.forEach((prediction) => {
    //   const [x, y, width, height] = prediction.bbox;

    //   // Draw bounding box
    //   ctx.strokeStyle = '#00FFFF';
    //   ctx.lineWidth = 2;
    //   ctx.strokeRect(x, y, width, height);

    //   // Draw label
    //   ctx.font = '16px sans-serif';
    //   ctx.fillStyle = '#000000';
    //   ctx.fillText(prediction.class, x, y);
    // });

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
      if (prediction.class === 'cell phone' && !this.isMobilePhoneAlerted) {
        this.isMobilePhoneAlerted = true;
        this.MobilePhone.emit();
        setTimeout(() => (this.isMobilePhoneAlerted = false), 2000); // Reset after 2 seconds
      }
      if (
        ['book', 'laptop'].includes(prediction.class) &&
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
    }
    clearInterval(this.faceMatchInterval);
  }

  async loadModels(): Promise<void> {
    const MODEL_URL = '/assets/models';
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);
  }
}
