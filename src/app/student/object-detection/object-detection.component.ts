import { Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { FaceMatchService } from '@core/service/face-match.service';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

@Component({
  selector: 'app-object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss'],
})
export class ObjectDetectionComponent {
  @Input() profilePic:string = '';

  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  detectionInterval: any;
  isMobilePhoneAlerted: boolean = false;
  isProhibitedObjectAlerted: boolean = false;
  isMultipleFaceAlerted: boolean = false;
  captureInterval:any;


  @Output() MobilePhone = new EventEmitter<void>();
  @Output() ProhibitedObject = new EventEmitter<void>();
  @Output() FaceNotVisible = new EventEmitter<void>();
  @Output() MultipleFacesVisible = new EventEmitter<void>();
  @Output() FaceMatchDetect = new EventEmitter<void>();
  @Output() FaceMisMatchDetect = new EventEmitter<void>();
  @Output() FaceMatchError = new EventEmitter<void>();

  count: number = 0;

constructor(private faceMatchService:FaceMatchService){}
  async ngOnInit() {;
    await this.startVideoStream();

    // this.initializeWebcam();
  }



 

  // Load Coco SSD model
  async loadCocoSsdModel() {
    const cocoModel = await cocoSsd.load();
    console.log('Coco SSD model loaded:', cocoModel);
  }

  async startVideoStream() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        // this.loadCocoSsdModel();
        setTimeout(() => {
          this.detectFace(video, canvas);
        }, 2000);
        this.captureAutoFaceMatch(video, canvas);
        return;
      })

    // // Get user media (video)
    // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // video.srcObject = stream;

    // // Set up canvas for faceapi detection
    // faceapi.matchDimensions(canvas, { width: video.width, height: video.height });
    // video.onplay = async () => {
    //   this.detectFace(video, canvas);
    // };
  }

  captureAutoFaceMatch(video: HTMLVideoElement, canvas: HTMLCanvasElement){
    this.captureInterval = setInterval(() => {
      this.detectFace(video, canvas)
    }, 30000);
  }

  // Detect face and match with given image URL
  async detectFace(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if(context){
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        // Send the Blob to the backend
        this.sendImageToBackend(blob);
      } else {
        console.error('Failed to create image blob.');
      }
    }, 'image/png');
   
    } 
  }

  sendImageToBackend(imageBlob: Blob){
    const formData = new FormData();
    formData.append('profileImage', imageBlob, 'captured-image.png'); // Append the Blob with a file name
    formData.append('imageUrl', this.profilePic);

    this.faceMatchService.checkFaceMatch(formData).subscribe( {
        next:(res)=>{
          if(res.data.isMatch){
            clearInterval(this.captureInterval);
            this.FaceMatchDetect.emit();
            const video = this.videoElement.nativeElement;
            const canvas = this.canvasElement.nativeElement;
            this.detectObjects(video, canvas);
          }else {
            this.FaceMisMatchDetect.emit();
          }
        },
        error:(error)=>{    
          console.error(error);
          clearInterval(this.captureInterval);
          this.FaceMatchError.emit();
      }
    }
      
    //   res=>{
    //   if(res.data.isMatch){
    //     clearInterval(this.captureInterval);
    //     this.FaceMatchDetect.emit();
    //     const video = this.videoElement.nativeElement;
    //     const canvas = this.canvasElement.nativeElement;
    //     this.detectObjects(video, canvas);
    //   }else{
    //     console.log(res);
    //   }
    // }
  )
  }

  async detectObjects(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const cocoModel = await cocoSsd.load();
    this.startDetection(video,cocoModel);
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
      // if (prediction.class === 'cell phone' && !this.isMobilePhoneAlerted) {
      //   this.isMobilePhoneAlerted = true;
      //   this.MobilePhone.emit();
      //   setTimeout(() => (this.isMobilePhoneAlerted = false), 2000); // Reset after 2 seconds
      // }
      if (
        ['book', 'laptop','cell phone'].includes(prediction.class) &&
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
  }

}