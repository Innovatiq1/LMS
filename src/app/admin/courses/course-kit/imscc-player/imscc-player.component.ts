import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-imscc-player',
  templateUrl: './imscc-player.component.html',
  styleUrls: ['./imscc-player.component.scss']
})
export class ImsccPlayerComponent implements OnInit {
  breadscrums = [
    {
      title: 'Blank',
      items: ['IMSCC Kit'],
      active: 'View IMSCC Kit',
    },
  ];
  
  iframeUrl: string = '';
  imsccKitId: string = '';
  imsccKit: any;
  private prefix: string = environment.Url;
  currentImsccModule: any;
  manifest: any;
  resources: any[] = [];
  organizations: any[] = [];
  currentResourceIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.imsccKitId = params['id'];
      this.getImsccKit(this.imsccKitId);
    });
  }

  ngOnInit(): void {}

  getImsccKit(id: string) {
    // Assuming the backend can handle IMSCC kits similar to SCORM
    this.courseService.getScormKit(id).subscribe((res) => {
      this.imsccKit = res.data;
      this.parseImsccManifest();
      this.loadFirstResource();
    });
  }

  parseImsccManifest() {
    // Parse the IMSCC manifest (imsmanifest.xml)
    if (this.imsccKit?.manifest) {
      this.manifest = this.imsccKit.manifest;
      this.resources = this.manifest.resources || [];
      this.organizations = this.manifest.organizations || [];
    } else if (this.imsccKit?.modules) {
      // Fallback to modules structure if manifest parsing isn't available
      this.resources = this.imsccKit.modules.map((module: any, index: number) => ({
        id: module._id || index.toString(),
        title: module.title,
        href: module.launch || module.href,
        type: this.getResourceType(module.launch || module.href)
      }));
    }
  }

  getResourceType(href: string): string {
    if (!href) return 'unknown';
    
    const extension = href.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return 'webcontent';
      case 'pdf':
        return 'pdf';
      case 'mp4':
      case 'webm':
      case 'ogg':
        return 'video';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'audio';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'webcontent';
    }
  }

  loadFirstResource() {
    if (this.resources.length > 0) {
      this.currentImsccModule = this.resources[0];
      this.currentResourceIndex = 0;
      this.loadResource(this.currentImsccModule);
    }
  }

  loadResource(resource: any) {
    if (!resource) return;
    
    const resourceUrl = this.imsccKit.path + '/' + resource.href;
    this.currentImsccModule = {
      ...resource,
      launchUrl: resourceUrl
    };
    
    // Handle different resource types
    switch (resource.type) {
      case 'pdf':
        this.iframeUrl = resourceUrl;
        break;
      case 'video':
        this.handleVideoContent(resourceUrl);
        break;
      case 'audio':
        this.handleAudioContent(resourceUrl);
        break;
      case 'image':
        this.handleImageContent(resourceUrl);
        break;
      default:
        this.iframeUrl = resourceUrl;
        break;
    }
  }

  handleVideoContent(url: string) {
    // Create a simple HTML wrapper for video content
    const videoHtml = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; background: #f5f5f5; }
            video { width: 100%; max-width: 800px; height: auto; }
            .container { text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <video controls>
              <source src="${url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        </body>
      </html>
    `;
    this.iframeUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(videoHtml);
  }

  handleAudioContent(url: string) {
    const audioHtml = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; background: #f5f5f5; }
            audio { width: 100%; max-width: 600px; }
            .container { text-align: center; padding-top: 50px; }
          </style>
        </head>
        <body>
          <div class="container">
            <audio controls>
              <source src="${url}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        </body>
      </html>
    `;
    this.iframeUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(audioHtml);
  }

  handleImageContent(url: string) {
    const imageHtml = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; background: #f5f5f5; text-align: center; }
            img { max-width: 100%; height: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <img src="${url}" alt="IMSCC Content">
        </body>
      </html>
    `;
    this.iframeUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(imageHtml);
  }

  openImsccResource(resource: any, index: number) {
    this.currentResourceIndex = index;
    this.loadResource(resource);
  }

  navigateNext() {
    if (this.currentResourceIndex < this.resources.length - 1) {
      this.currentResourceIndex++;
      this.loadResource(this.resources[this.currentResourceIndex]);
    }
  }

  navigatePrevious() {
    if (this.currentResourceIndex > 0) {
      this.currentResourceIndex--;
      this.loadResource(this.resources[this.currentResourceIndex]);
    }
  }

  getResourceIcon(type: string): string {
    switch (type) {
      case 'pdf': return 'file-text';
      case 'video': return 'video';
      case 'audio': return 'volume-2';
      case 'image': return 'image';
      case 'webcontent': return 'globe';
      default: return 'file';
    }
  }
}
