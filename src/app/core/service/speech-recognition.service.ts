import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private microphone!: MediaStreamAudioSourceNode;
  private dataArray!: Uint8Array;
  private isListening = false;
  private isComponentActive = true; // Track component state
  voiceDetected = new Subject<boolean>(); 
  private isVoiceDetected:boolean=false;
  private mediaStream!: MediaStream;
  
  async startListening(callback: (detected: boolean) => void) {
    if (this.isListening) return;

    this.isListening = true;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512; // Smaller size for better voice detection
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.microphone.connect(this.analyser);

      this.detectVoice(callback);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }

  private detectVoice(callback: (detected: boolean) => void) {
    if (!this.isComponentActive) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const avgVolume = this.getAverageVolume(this.dataArray);

    // Adjust threshold based on testing
    const isVoiceDetected = avgVolume > 30; // Higher value = more strict detection

    if (isVoiceDetected && !this.isVoiceDetected) {
      this.isVoiceDetected=true;
      setTimeout(() => {
        this.isVoiceDetected=false;
      }, 5000);
      callback(true); // Notify component
    }

    requestAnimationFrame(() => this.detectVoice(callback));
  }

  private getAverageVolume(array: Uint8Array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum / array.length;
  }

  stopListening() {
    this.isComponentActive = false;
    this.isListening = false;

    // Stop all microphone tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Close the audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    console.log('🛑 Voice detection stopped.');
  }
}
