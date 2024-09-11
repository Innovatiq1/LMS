import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private videoId!: string;
constructor(private router: Router){}
  setVideoId(id: string) {
    this.videoId = id;
  }

  getVideoId() {
    return this.videoId;
  }

  private progressArray: any[] = [];

  getProgressArray(): any[] {
    return this.progressArray;
  }

  setProgress(progress: any): void {
    this.progressArray=progress
  }

  private playBackTime!: number;

  setPlayBackTime(time: number) {
    this.playBackTime = time;
  }

  getPlayBackTime() {
    return this.playBackTime;
  }

  private videoDetails: any;

  setVideoDetails(video: any) {
    this.videoDetails = video;
  }

  getVideoDetails() {
    return this.videoDetails;
  }

  private roleDetails: any;

  setRoleDetails(data: any) {
    this.roleDetails = data;
  }

  getRoleDetails() {
    return this.roleDetails;
  }


  private completedPercentage!: number;

  setCompletedPercentage(time: number) {
    this.completedPercentage = time;
  }

  getCompletedPercentage() {
    return this.completedPercentage;
  }
  private notifyVideo = new Subject<void>();
  private unsubscribe$ = new Subject<void>();


  notifyVideoObservable$ = this.notifyVideo.asObservable();

  notifyVideoMethod() {
    this.notifyVideo.next();
  }
  getUnsubscribeSignal() {
    return this.unsubscribe$.asObservable();
  }

  unsubscribe() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  generate4DigitId(): string {
    // Generate a random number between 1000 and 9999
    return (Math.floor(Math.random() * 9000) + 1000).toString();
  }


  navigateWithCompanyName(name: string, path: string) {
    if (name) {
      this.router.navigate([`/${name}/${path}`]);
    } else {
    }
  }



}
