import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CertificateService } from 'app/core/service/certificate.service';
import { forkJoin } from 'rxjs';
import { text } from 'd3';
import { CourseService } from '@core/service/course.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenService } from '@core/service/authen.service';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.scss'],
})
export class CreateCertificateComponent implements OnInit {
  breadcrumbs:any[] = []
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;

  isDrawing = false;
  context: CanvasRenderingContext2D | null = null;
  isInserted = false;

  certificateForm!: FormGroup;
  isSubmitted = false;
  editUrl!: boolean;
  classId!: any;
  viewUrl: boolean;
  title: boolean = false;
  submitted: boolean = false;
  course: any;
  thumbnail: any;
  image_link: any;
  uploaded: any;
  uploadedImage: any;
  isEdit = false;
  editingElementIndex: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
    toolbarHiddenButtons: [['strikethrough']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  elementOptions = [
    'H1',
    'H2',
    'H3',
    'Paragraph',
    'UserName',
    'Signature',
    'Logo',
    'Course',
    'Date',
  ];
  selectedElement = 'H1';
  elements: any[] = [];
  currentElement: any = {
    fontSize: 16,
    color: '#000',
    alignment: 'left',
  };
  storedItems: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _activeRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private courseService: CourseService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private authenService: AuthenService,
    private el: ElementRef
  ) {

    
    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadcrumbs = [
       {
         title: '', 
         items: [this.storedItems],  
         active: 'Create Certificate',  
       },
     ];
   }
    this._activeRoute.queryParams.subscribe((params) => {
      this.classId = params['id'];
      if (this.classId) {
        this.title = true;
      }
    });
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit');
    this.viewUrl = urlPath.includes('view');

    if (this.editUrl == true) {
      this.breadcrumbs = [
        {
          title: 'Certificate',
          items: [this.storedItems],
          active: 'Edit Certificate',
        },
      ];
    }
    if (this.viewUrl == true) {
      this.breadcrumbs = [
        {
          title: 'Certificate',
          items: [this.storedItems],
          active: 'View Certificate',
        },
      ];
    }
    if (this.editUrl || this.viewUrl) {
      this.getData();
    }
  }

  // Resizing State
  isResizing = false;
  resizingElementIndex: number | null = null;
  resizingStartWidth: number = 0;
  resizingStartHeight: number = 0;
  resizingStartX: number = 0;
  resizingStartY: number = 0;

  startResizing(event: MouseEvent, index: number) {
    this.isResizing = true;
    this.resizingElementIndex = index;

    event.preventDefault();

    // Save initial dimensions and mouse position
    this.resizingStartWidth = this.elements[index].width || 100;
    this.resizingStartHeight = this.elements[index].height || 100;
    this.resizingStartX = event.clientX;
    this.resizingStartY = event.clientY;

    // Attach mouse move and mouse up event listeners
    document.addEventListener('mousemove', this.resizeElement.bind(this));
    document.addEventListener('mouseup', this.stopResizing.bind(this));
  }

  resizeElement(event: MouseEvent) {
    if (this.isResizing && this.resizingElementIndex !== null) {
      const dx = event.clientX - this.resizingStartX;
      const dy = event.clientY - this.resizingStartY;

      // Update the size of the element being resized
      this.elements[this.resizingElementIndex].width =
        this.resizingStartWidth + dx;
      this.elements[this.resizingElementIndex].height =
        this.resizingStartHeight + dy;
    }
  }

  stopResizing() {
    this.isResizing = false;
    this.resizingElementIndex = null;

    // Remove mouse move and mouse up event listeners
    document.removeEventListener('mousemove', this.resizeElement.bind(this));
    document.removeEventListener('mouseup', this.stopResizing.bind(this));
  }

  edit() {
    this.router.navigate(
      ['/student/settings/customize/certificate/template/edit/:id'],
      {
        queryParams: { id: this.classId },
      }
    );
  }

  insertElement() {
    if (this.selectedElement === 'Signature') {
      this.isInserted = true;
      const canvas = this.el.nativeElement.querySelector(
        '#signaturePad'
      ) as HTMLCanvasElement;
      if (canvas) {
        this.context = canvas.getContext('2d');
        if (this.context) {
          this.context.strokeStyle = '#000';
          this.context.lineWidth = 2;
        }
      }
    } else if (this.selectedElement === 'Logo') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      fileInput.addEventListener('change', (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('files', file);

          this.courseService.uploadCourseThumbnail(formData).subscribe(
            (data: any) => {
              let imageUrl = data.data.thumbnail;
              imageUrl = imageUrl.replace(/\\/g, '/');
              imageUrl = encodeURI(imageUrl);

              const newElement = {
                type: this.selectedElement,
                content: '', // No content for logos
                imageUrl: imageUrl,
                editable: false,
                fontSize: null,
                color: null,
                alignment: this.currentElement.alignment || 'left',
              };
              this.elements.push(newElement);
            },
            (error) => {
              console.error('Upload error:', error);
            }
          );
        }
      });

      fileInput.click();
    } else {
      const newElement = {
        type: this.selectedElement,
        content: this.getContentForElement(this.selectedElement),
        editable: true,
        fontSize: this.currentElement.fontSize || 16,
        color: this.currentElement.color || '#000',
        alignment: this.currentElement.alignment || 'left',
      };
      this.elements.push(newElement);
    }
    this.editingElementIndex = this.elements.length - 1;
  }
  getContentForElement(type: string): string {
    switch (type) {
      case 'H1':
        return 'Heading 1';
      case 'H2':
        return 'Heading 2';
      case 'H3':
        return 'Heading 3';
      case 'Paragraph':
        return 'Your paragraph here...';
      case 'UserName':
        return 'Name';
      case 'Signature':
        return 'Signature';
      case 'Logo':
        return 'Logo';
      case 'Course':
        return 'Course';
      case 'Date':
        return 'Date';
      default:
        return '';
    }
  }

  updateElementStyle() {
    const container = document.querySelector(
      '.certificate-canvas'
    ) as HTMLElement;

    if (this.currentElement.alignment === 'left') {
      container.style.justifyContent = 'flex-start';
    } else if (this.currentElement.alignment === 'center') {
      container.style.justifyContent = 'center';
    } else if (this.currentElement.alignment === 'right') {
      container.style.justifyContent = 'flex-end';
    }

    // this.elements = this.elements.map((element) => {
    //   if (element === this.elements[this.editingElementIndex]) {
    //     return {
    //       ...element,
    //       fontSize: this.currentElement.fontSize || 16,
    //       color: this.currentElement.color || '#000',
    //       alignment: this.currentElement.alignment || 'left'
    //     };
    //   }
    //   return element;
    // });
  }

  updateElementContent(event: Event, element: any) {
    const target = event.target as HTMLElement;

    // Save the current cursor position
    const sel = window.getSelection();
    let cursorPos = { start: 0, end: 0 };

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      cursorPos.start = range.startOffset;
      cursorPos.end = range.endOffset;
    }

    element.content = target.innerText;

    // Restore the cursor position
    if (sel && sel.rangeCount > 0) {
      const range = document.createRange();
      const textNode = target.firstChild as Text;

      if (textNode) {
        // Set the cursor at the end of the content
        range.setStart(
          textNode,
          Math.min(cursorPos.start, textNode.textContent?.length || 0)
        );
        range.setEnd(
          textNode,
          Math.min(cursorPos.end, textNode.textContent?.length || 0)
        );

        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const index = parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
    if (isNaN(index)) return;

    const containerRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    this.elements[index] = {
      ...this.elements[index],
      top: y,
      left: x,
    };
  }

  onDragEnd(event: DragEvent) {
    // Optionally handle any cleanup or updates after the drag ends
  }
  ngOnInit() {
    const roleDetails =
      this.authenService.getRoleDetails()[0].settingsMenuItems;
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath[3]}`;
    const childId = `${urlPath[4]}/${urlPath[5]}`;
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter(
      (item: any) => item.id == childId
    );
    let actions = childData[0].actions;
    let editAction = actions.filter((item: any) => item.title == 'Edit');

    if (editAction.length > 0) {
      this.isEdit = true;
    }
    this.certificateForm = this.fb.group({
      title: ['', [Validators.required]],
      // title: ['', Validators.required],
    });
  }
  // ngAfterViewInit() {
  //   if (this.selectedElement === 'Signature') {
  //     const canvas = this.el.nativeElement.querySelector('#signaturePad') as HTMLCanvasElement;
  //     if (canvas) {
  //       this.context = canvas.getContext('2d');
  //       if (this.context) {
  //         this.context.strokeStyle = '#000';
  //         this.context.lineWidth = 2;
  //       }
  //     }
  //   }
  // }

  startDrawing(event: MouseEvent) {
    if (this.context) {
      this.isDrawing = true;
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      this.context.beginPath();
      this.context.moveTo(offsetX, offsetY);
    }
  }
  draw(event: MouseEvent) {
    // console.log("hello draw",this.context)
    if (this.isDrawing && this.context) {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
    }
  }
  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
    }
  }

  saveSignature() {
    if (this.context) {
      const canvas = this.el.nativeElement.querySelector(
        '#signaturePad'
      ) as HTMLCanvasElement;
      const dataURL = canvas.toDataURL('image/png');
      const newElement = {
        type: 'Signature',
        imageUrl: dataURL,
        top: 100,
        left: 100,
        width: 100,
        height: 50,
      };
      this.elements.push(newElement);
    }
  }

  clearSignature() {
    if (this.context) {
      const canvas = this.el.nativeElement.querySelector(
        '#signaturePad'
      ) as HTMLCanvasElement;
      if (this.context) {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
  selectElement(index: number) {
    if (this.isEdit) {
      this.editingElementIndex = index;
      const selectedElement = this.elements[index];
      this.currentElement = {
        fontSize: selectedElement.fontSize || 16,
        color: selectedElement.color || '#000',
        alignment: selectedElement.alignment || 'left',
      };

      this.updateElementStyle(); // Update alignment when an element is selected
    }
  }

  isEditingElement(index: number): boolean {
    return this.editingElementIndex === index;
  }

  deleteElement(index: number) {
    this.elements.splice(index, 1);
    this.editingElementIndex = null;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    const allowedFormats = ['image/png', 'image/jpeg'];

    if (file) {
      if (!allowedFormats.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Format',
          text: 'Please upload a .png or .jpeg image file.',
        });
        return;
      }

      // Replace spaces in the file name with underscores or dashes
      const updatedFileName = file.name.replace(/\s+/g, '-'); // Use underscores (_) if preferred

      // Create a new file with the updated name
      const updatedFile = new File([file], updatedFileName, {
        type: file.type,
      });

      const formData = new FormData();
      formData.append('files', updatedFile);

      this.courseService.uploadCourseThumbnail(formData).subscribe(
        (data: any) => {
          let imageUrl = data.data.thumbnail;
          this.image_link = data.data.thumbnail;
          imageUrl = imageUrl.replace(/\\/g, '/');
          imageUrl = encodeURI(imageUrl); // Ensure the image URL is properly encoded
          this.setBackgroundImage(imageUrl);

          this.uploaded = imageUrl?.split('/');
          let image = this.uploaded?.pop();
          this.uploaded = image?.split('\\');
          this.uploadedImage = this.uploaded?.pop();
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
    }
  }

  // onFileUpload(event: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     this.thumbnail = file;
  //     const formData = new FormData();
  //     formData.append('files', this.thumbnail);

  //     this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) => {
  //       let imageUrl = data.data.thumbnail;
  //       this.image_link = data.data.thumbnail;
  //       imageUrl = imageUrl.replace(/\\/g, '/');
  //       imageUrl = encodeURI(imageUrl);
  //       this.setBackgroundImage(imageUrl);

  //       this.uploaded = imageUrl?.split('/');
  //       let image = this.uploaded?.pop();
  //       this.uploaded = image?.split('\\');
  //       this.uploadedImage = this.uploaded?.pop();
  //     }, (error) => {
  //       console.error('Upload error:', error);
  //     });
  //   }
  // }

  private setBackgroundImage(imageUrl: string) {
    imageUrl = encodeURI(imageUrl);
    console.log('Image Url=', imageUrl);
    this.image_link = imageUrl;
    this.backgroundTable.nativeElement.style.backgroundImage = `url(${imageUrl})`;
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(
        this.backgroundTable.nativeElement
      );
    }, 1000);
  }

  private collectFormData() {
    const formData = {
      ...this.certificateForm.value,
      image: this.image_link,
      elements: this.elements,
    };

    return formData;
  }

  saveCertificate() {
    if (this.certificateForm.valid) {
      const formData = this.collectFormData();
      if (!this.editUrl) {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user
          .companyId;

        this.isSubmitted = true;
        // this.certificateForm.value.companyId=userId;
        formData.companyId = userId;

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create Certificate!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.certificateForm.value.image = this.image_link;
            this.certificateService
              .createCertificate(formData)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Certificate Created successfully.',
                  icon: 'success',
                });
                window.history.back();
                // this.router.navigateByUrl(
                //   `/student/settings/certificate/template`
                // );
              });
          }
        });
        //  }
      }
      if (this.editUrl) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to update this certificate!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.certificateForm.value.image = this.image_link;
            this.certificateService
              .updateCertificate(this.classId, formData)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Certificate updated successfully.',
                  icon: 'success',
                });
                window.history.back();
              });
          }
        });
      }
    } else {
      this.submitted = true;
    }
  }
  getData() {
    forkJoin({
      course: this.certificateService.getCertificateById(this.classId),
    }).subscribe((response: any) => {
      this.course = response.course;
      let imageUrl = this.course.image;
      imageUrl = imageUrl.replace(/\\/g, '/');
      imageUrl = encodeURI(imageUrl);

      this.certificateForm.patchValue({
        title: this.course.title,
      });
      this.elements = this.course.elements || [];
      this.setBackgroundImage(imageUrl);
    });
  }
}
