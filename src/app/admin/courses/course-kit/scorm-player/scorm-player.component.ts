import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { environment } from 'environments/environment';
declare var Scorm2004API: any;

@Component({
  selector: 'app-scorm-player',
  templateUrl: './scorm-player.component.html',
  styleUrls: ['./scorm-player.component.scss']
})
export class ScormPlayerComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Scorm Kit'],
      active: 'View Scorm Kit',
    },
  ];
  iframeUrl: string = '';
  scormKitId:string='';
  scormKit:any;
  private prefix: string = environment.Url;
  currentScormModule: any;

  constructor(
        private activatedRoute: ActivatedRoute,
    private courseService:CourseService
  ){
    this.activatedRoute.params.subscribe((params) => {
      this.scormKitId = params['id'];
      this.getScormKit(this.scormKitId);
    });
  }

  getScormKit(id:string){
    this.courseService.getScormKit(id).subscribe((res)=>{
      this.scormKit = res.data;
      const launchModule = this.scormKit?.modules[0];
      if(!launchModule)
        return;
      const launchUrl = this.scormKit.path + '/' + launchModule.launch
      this.currentScormModule = {
        ...launchModule,
        launchUrl,
      }
      this.initScorm2004(launchUrl);
    })
  }

  initScorm2004(contentUrl: string) {
    this.iframeUrl = contentUrl;
    const settings = {
      autocommit: false,
      autocommitSeconds: 5,
      dataCommitFormat: 'json',
      commitRequestDataType: 'application/json;charset=UTF-8',
      autoProgress: true,
      logLevel: 0,
      mastery_override: false,
    };
    (window as any).API_1484_11 = new Scorm2004API(settings);
  }

  openScormModule(module: any, scormKit: any) {
    console.log(scormKit);
    const launchUrl = scormKit.path + '/' + module.launch
    this.currentScormModule = {
      ...module,
      launchUrl,
    };
    this.initScorm2004(this.currentScormModule.launchUrl);
  }
}
