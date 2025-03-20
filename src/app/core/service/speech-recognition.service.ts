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
  private dynamicThreshold = 35;
  
  async startListening(callback: (detected: boolean) => void) {
    if (this.isListening) return;

    this.isListening = true;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256; // Smaller size for better voice detection
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.microphone.connect(this.analyser);
      await this.measureBackgroundNoise();
      this.detectVoice(callback);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }

  private async measureBackgroundNoise() {
    if (!this.analyser) return;
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    let noiseLevels: number[] = [];
    console.log('⏳ Measuring background noise...');

    return new Promise<void>((resolve) => {
      const measure = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(this.dataArray);
        const avgNoise = this.dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        noiseLevels.push(avgNoise);

        if (noiseLevels.length < 50) {
          requestAnimationFrame(measure);
        } else {
          const backgroundNoise = noiseLevels.reduce((sum, val) => sum + val, 0) / noiseLevels.length;
          this.dynamicThreshold = Math.max(10, backgroundNoise + 10); // Add buffer to avoid false positives
          console.log(`✅ Dynamic Threshold Set: ${this.dynamicThreshold}`);
          resolve();
        }
      };
      measure();
    });
  }

  private detectVoice(callback: (detected: boolean) => void) {
    if (!this.isComponentActive) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const avgVolume = this.getAverageVolume(this.dataArray);

    // Adjust threshold based on testing
    const isVoiceDetected = avgVolume > this.dynamicThreshold; // Higher value = more strict detection

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
