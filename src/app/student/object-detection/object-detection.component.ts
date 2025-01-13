import { Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, ElementRef } from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

@Component({
  selector: 'app-object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss']
})
export class ObjectDetectionComponent {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  detectionInterval: any;
  isMobilePhoneAlerted: boolean = false;
  isProhibitedObjectAlerted: boolean = false;

  @Output() MobilePhone = new EventEmitter<void>();
  @Output() ProhibitedObject = new EventEmitter<void>();
  @Output() FaceNotVisible = new EventEmitter<void>();
  @Output() MultipleFacesVisible = new EventEmitter<void>();

  count: number = 0;

  ngOnInit(): void {
    this.initializeWebcam();
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
        return cocoSsd.load();
      })
      .then((model) => this.startDetection(video, model))
      .catch(console.error);
  }

  startDetection(video: HTMLVideoElement, model: cocoSsd.ObjectDetection): void {
    const detectFrame = () => {
      model.detect(video).then((predictions) => {
        this.processPredictions(predictions);
        requestAnimationFrame(detectFrame);
      });
    };
    detectFrame();
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
      if (prediction.class === 'cell phone'&& !this.isMobilePhoneAlerted) {
        this.isMobilePhoneAlerted = true;
        this.MobilePhone.emit();
        setTimeout(() => (this.isMobilePhoneAlerted = false), 2000); // Reset after 2 seconds
      }
      if (['book', 'laptop'].includes(prediction.class) && !this.isProhibitedObjectAlerted) {
        this.isProhibitedObjectAlerted = true;
        this.ProhibitedObject.emit();
        setTimeout(() => (this.isProhibitedObjectAlerted = false), 2000); // Reset after 2 seconds
      }
    });

    if (faces > 1) this.MultipleFacesVisible.emit();
  }

  cleanupResources(): void {
    const video = this.videoElement.nativeElement;
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }


}
