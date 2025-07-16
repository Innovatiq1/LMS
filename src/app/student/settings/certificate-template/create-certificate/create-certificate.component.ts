import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { CertificateService } from 'app/core/service/certificate.service';
import { forkJoin } from 'rxjs';
import { text } from 'd3';
import { CourseService } from '@core/service/course.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenService } from '@core/service/authen.service';
import type { FabricObject } from 'fabric/fabric-impl';

// import type { Canvas, FabricText } from 'fabric/fabric-impl';

import * as fabric from 'fabric';
import { cos } from '@tensorflow/tfjs';
// import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.scss'],
})
export class CreateCertificateComponent implements OnInit, AfterViewInit {
  breadscrums = [
    {
      title: 'Certificate',
      items: ['Customize'],
      active: 'Create Certificate',
    },
  ];
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;

  @ViewChild('fileInput_background')
  fileInput_background!: ElementRef<HTMLInputElement>;

  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('signatureInput') signatureInput!: ElementRef<HTMLInputElement>;

  fontStyles = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Verdana',
  ];

  isDrawing = false;
  context: CanvasRenderingContext2D | null = null;
  isInserted = false;
  canvas: any;
  certificateForm!: FormGroup;
  isSubmitted = false;
  editUrl!: boolean;
  classId!: any;
  viewUrl: boolean;
  title: boolean = false;
  submitted: boolean = false;
  course: any;
  SelectedCanvaObject: any = null;
  thumbnail: any;
  image_link: any;
  uploaded: any;
  uploadedImage: any;
  isEdit = false;
  canvaObjectsclone: any = null;
  paragraph_text_count: number = 0;
  editingElementIndex: any;
  fontColor: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Description',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',

    toolbarHiddenButtons: [
      [
        'customClasses',
        'strikeThrough',
        'removeFormat',
        'toggleEditorMode',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertOrderedList',
        'insertUnorderedList',
        'heading',
        'fontName',
      ],
    ],
  };
  elementOptions = [
    'User Name',
    'Date',
    'Grade',
    'GPA',
    'Grade Term',
    'Percentage',
  ];
  selectedElement: any;
  elements: any[] = [];
  currentElement: any = 'Choose Font Family';
  fontStyleSelected: any = null;
  fontStyleOptions = [
    { label: 'Normal', fontWeight: 'normal', fontStyle: 'normal' },
    { label: 'Bold', fontWeight: 'bold', fontStyle: 'normal' },
    { label: 'Italic', fontWeight: 'normal', fontStyle: 'italic' },
    { label: 'Bold Italic', fontWeight: 'bold', fontStyle: 'italic' },
  ];
  fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  fontSizeSelected: any;

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
      this.breadscrums = [
        {
          title: 'Certificate',
          items: ['Certificate'],
          active: 'Edit Certificate',
        },
      ];
    }
    if (this.viewUrl == true) {
      this.breadscrums = [
        {
          title: 'Certificate',
          items: ['Certificate'],
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
    this.editUrl = true;
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
        fontStyle: this.currentElement.fontStyle || 'Arial',
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
        return 'Course N';
      case 'Date':
        return 'Date';
      case 'Grade':
        return 'Grade';
      case 'GPA':
        return 'GPA';
      case 'Grade Term':
        return 'Grade Term';
      case 'Percentage':
        return 'Percentage';
      default:
        return '';
    }
  }

  updateElementStyle() {
    const target = this.canvas
      .getObjects()
      .find((obj: any) => obj.customId === this.SelectedCanvaObject.customId);

    if (target && 'set' in target) {
      target.set('fontFamily', this.currentElement);
      this.canvas.renderAll();
    }

    // const selectedElement = this.elements[this.editingElementIndex];
    // if (selectedElement) {
    //   selectedElement.fontSize = this.currentElement.fontSize;
    //   selectedElement.color = this.currentElement.color;
    //   selectedElement.fontStyle = this.currentElement.fontStyle; // Apply font style
    //   selectedElement.alignment = this.currentElement.alignment;
    // }
    // this is the code i made comment
    // const container = document.querySelector(
    //   '.certificate-canvas'
    // ) as HTMLElement;
    // if (this.currentElement.alignment === 'left') {
    //   container.style.justifyContent = 'flex-start';
    // } else if (this.currentElement.alignment === 'center') {
    //   container.style.justifyContent = 'center';
    // } else if (this.currentElement.alignment === 'right') {
    //   container.style.justifyContent = 'flex-end';
    // }
    //this is previous code old code commented previously
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

  applyFontStyle(): void {
    const target = this.canvas
      .getObjects()
      .find((obj: any) => obj.customId === this.SelectedCanvaObject.customId);

    if (!target || !('set' in target)) {
      return;
    }

    target.set({
      fontWeight: this.fontStyleSelected.fontWeight,
      fontStyle: this.fontStyleSelected.fontStyle,
    });

    this.canvas.renderAll();
  }

  updateFontSize() {
    const obj = this.canvas
      .getObjects()
      .find((o: any) => o.customId === this.SelectedCanvaObject.customId);
    if (obj) {
      obj.set('fontSize', this.fontSizeSelected);
      this.canvas.renderAll();
    }
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
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
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

  ngAfterViewInit(): void {
    (fabric.Object.prototype.toObject as any) = (function (originalToObject) {
      return function (this: FabricObject, propertiesToInclude: string[] = []) {
        return originalToObject.call(this, [
          'customId',
          'text',
          'fontSize',
          'fontFamily',
          'fill',
          'fontWeight',
          'fontStyle',
          'textAlign',
          'imageType',
          'left',
          'top',
          'scaleX',
          'scaleY',
          'angle',
          'width',
          'height',
          'opacity',
          'visible',
          'selectable',
          'evented',
          ...propertiesToInclude,
        ]);
      };
    })(fabric.Object.prototype.toObject);

    this.canvas = new fabric.Canvas('myCanvas', {
      width: 789,
      height: 555,
    });
    this.canvas.on('selection:created', (e: any) => {
      const selected = e.selected?.[0];
      if (selected) {
        this.SelectedCanvaObject = selected;
        console.log(this.SelectedCanvaObject, '===>><<<');
      }
    });
    this.canvas.on('mouse:down', (event: any) => {
      if (!event.target) {
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
        this.SelectedCanvaObject = null;
      }
    });

    this.canvas.on('selection:updated', (e: any) => {
      const selected = e.selected?.[0];
      if (selected) {
        this.SelectedCanvaObject = selected;
        console.log(this.SelectedCanvaObject, '===>><<<');
      }
    });
  }

  uploadImage(event: Event): void {
    this.canvaObjectsclone = [...this.canvas.getObjects()];
    this.canvas.clear();
    console.log(this.canvaObjectsclone, '===');

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }
    if (!this.canvas) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      console.log(imageDataUrl, '---->>> <<----');
      console.log('======> END === <=============');
      this.image_link = imageDataUrl;
      const imgElement = new Image();
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement);
        (fabricImg as any).customId = 'BACKGROUND_IMAGE';
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();

        fabricImg.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });

        fabricImg.scaleToWidth(canvasWidth);
        fabricImg.scaleToHeight(canvasHeight);

        try {
          this.canvas.backgroundImage = fabricImg;
          if (this.canvaObjectsclone != null) {
            this.canvaObjectsclone.forEach((obj: any) => {
              this.canvas.add(obj);
            });
            this.canvas.requestRenderAll();
            this.canvaObjectsclone = null;
          }
        } catch (error) {
          (fabricImg as any).excludeFromExport = false;
          this.canvas.add(fabricImg);
          this.canvas.sendToBack(fabricImg);
          this.canvas.requestRenderAll();

          if (this.canvaObjectsclone != null) {
            this.canvaObjectsclone.forEach((obj: any) => {
              this.canvas.add(obj);
            });
            this.canvas.requestRenderAll();
            this.canvaObjectsclone = null;
          }
        }
      };

      imgElement.src = imageDataUrl;
    };

    reader.readAsDataURL(file);
  }

  loadTemplate(imagePath: string) {
    if (!this.canvas) {
      return;
    }
    if (this.canvas.getObjects().length > 0) {
      this.canvaObjectsclone = [...this.canvas.getObjects()];
      this.canvas.clear();
    }

    const img = new Image();

    img.onload = () => {
      const fabricImg = new fabric.Image(img);
      const images_urls = fabricImg.toDataURL({});
      this.image_link = images_urls;
      // console.log('Image as base64 data URL:', imps);
      fabricImg.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });
      fabricImg.scaleToWidth(this.canvas.getWidth());
      fabricImg.scaleToHeight(this.canvas.getHeight());
      this.canvas.backgroundImage = fabricImg;
      if (this.canvaObjectsclone != null) {
        this.canvaObjectsclone.forEach((obj: any) => this.canvas.add(obj));
      }
      this.canvas.requestRenderAll();
    };
    img.src = imagePath;
  }

  uploadtemplate() {
    this.fileInput_background.nativeElement.click();
  }

  addPlaceholder(placeholderKey: string): void {
    const CanvaResponse = this.findObjectInCanava(placeholderKey);
    if (CanvaResponse) {
      Swal.fire({
        icon: 'info',
        text: `${placeholderKey} already found !`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      const placeholderText = `${placeholderKey}`;
      const text = new fabric.Textbox(placeholderText, {
        left: 100,
        top: 100,
        width: 300,
        fontSize: 24,
        fill: '#000',
        selectable: true,
        editable: true,
      });

      text.customId = uuidv4();
      this.canvas.add(text);
      this.canvas.renderAll();
      console.log(this.canvas.getObjects());
    }
  }

  addParagraph() {
    const placeholderText = 'paragraph';
    const text = new fabric.Textbox(placeholderText, {
      left: 100,
      top: 100,
      width: 300,
      fontSize: 15,
      fill: '#000',
      selectable: true,
      editable: true,
    });

    text.customId = uuidv4();
    this.canvas.add(text);
    this.canvas.renderAll();
  }
  onElementSelect(placeholderKey: string): void {
    const CanvaResponse = this.findObjectInCanava(placeholderKey);
    console.log(CanvaResponse);
    if (CanvaResponse) {
      Swal.fire({
        icon: 'info',
        text: `${placeholderKey} already found !`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      const placeholderText = placeholderKey;
      const text = new fabric.Text(placeholderText, {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: '#000',
        selectable: true,
      });
      text.customId = uuidv4();

      this.canvas.add(text);
      this.canvas.setActiveObject(text);
      this.canvas.renderAll();
    }
  }

  findObjectInCanava(placeholderKey: any) {
    const objects = this.canvas.getObjects();
    const target: any = objects.find(
      (obj: any) => (obj as any).customId === placeholderKey
    );
    if (target) {
      return true;
    } else {
      return false;
    }
  }

  RemoveCanvaObject() {
    if (this.SelectedCanvaObject != null) {
      this.canvas.remove(this.SelectedCanvaObject);
      this.canvas.renderAll();
    }
  }

  //   uploadLogo() {
  //   this.logoInput.nativeElement.click();
  // }
  uploadLogo() {
    this.logoInput.nativeElement.click();
  }
  click_LogoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      const imgElement = new Image();

      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: 150,
          top: 150,
          scaleX: 0.3,
          scaleY: 0.3,
          selectable: true,
        });
        (fabricImg as any).customId = uuidv4();

        this.canvas.add(fabricImg);
        this.canvas.setActiveObject(fabricImg);
        this.canvas.renderAll();
      };
      imgElement.src = imageDataUrl;
    };

    reader.readAsDataURL(file);
  }

  uploadSignature() {
    this.signatureInput.nativeElement.click();
  }
  click_signatureUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      const imgElement = new Image();
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: 150,
          top: 150,
          scaleX: 0.3,
          scaleY: 0.3,
          selectable: true,
        });
        (fabricImg as any).customId = uuidv4();

        this.canvas.add(fabricImg);
        this.canvas.setActiveObject(fabricImg);
        this.canvas.renderAll();
      };
      imgElement.src = imageDataUrl;
    };

    reader.readAsDataURL(file);
  }

  fontColorUpdate() {
    const target = this.canvas
      .getObjects()
      .find((obj: any) => obj.customId === this.SelectedCanvaObject.customId);

    if (target && (target.type === 'textbox' || target.type === 'text')) {
      target.set({
        fill: this.fontColor || '#000',
      });

      this.canvas.renderAll();
    }
  }

  StyleCanvaObject() {
    if (this.SelectedCanvaObject != null) {
    }
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
      console.log('selectedElement', selectedElement);
      this.currentElement = {
        fontSize: selectedElement.fontSize || 16,
        color: selectedElement.color || '#000',
        alignment: selectedElement.alignment || 'left',
        fontStyle: selectedElement.fontStyle || 'Arial',

        //  fontStyles:selectedElement.fontStyles || 'Arial',
        // selectedElement.fontStyle = this.currentElement.fontStyle
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
    const canvasJson = this.canvas.toJSON([]);
    const CanvaObjects = canvasJson.objects.map((obj: any) => ({
      customId: obj.customId,
      type: obj.type,
      text: obj.text || null,
      fontSize: obj.fontSize || null,
      fontFamily: obj.fontFamily || null,
      fill: obj.fill || null,
      fontWeight: obj.fontWeight || null,
      fontStyle: obj.fontStyle || null,
      textAlign: obj.textAlign || null,
      src: obj.src || null,
      left: obj.left,
      top: obj.top,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
      width: obj.width,
      height: obj.height,
      selectable: obj.selectable,
      evented: obj.evented,
      flipX: obj.flipX,
      flipY: obj.flipY,
      originX: obj.originX,
      originY: obj.originY,
      opacity: obj.opacity,
      visible: obj.visible,
    }));
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const formData: any = {
      title: this.certificateForm.value.title,
      image: this.image_link,
      elements: CanvaObjects,
      companyId: userId,
    };
    return formData;
  }

  saveCertificate() {
    if (this.certificateForm.valid) {
      const formData = this.collectFormData();
      console.log(formData, '==><==');
      if (!this.editUrl) {
        this.isSubmitted = true;
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create Certificate!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.certificateService
              .createCertificate(formData)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Certificate Created successfully.',
                  icon: 'success',
                });
                window.history.back();
                this.router.navigateByUrl(
                  `/student/settings/certificate/template`
                );
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
      Swal.fire({
        icon: 'info',
        text: 'Please Enter the Certificate title',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  patchCanvaBackgroundImage(imageurl: any) {
    this.image_link = null;
    const imageDataUrl = imageurl;
    this.image_link = imageDataUrl;

    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new fabric.Image(imgElement);
      (fabricImg as any).customId = 'BACKGROUND_IMAGE';
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      fabricImg.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });

      fabricImg.scaleToWidth(canvasWidth);
      fabricImg.scaleToHeight(canvasHeight);

      try {
        this.canvas.backgroundImage = fabricImg;
        this.canvas.requestRenderAll();
      } catch (error) {
        (fabricImg as any).excludeFromExport = false;
        this.canvas.add(fabricImg);
        this.canvas.sendToBack(fabricImg);
        this.canvas.requestRenderAll();
      }
    };

    imgElement.src = imageDataUrl;
  }

  loadCanvaContent(imageurl: any) {
    const CleanedDataset: any = [];
    this.canvaObjectsclone.map((element: any) => {
      element.selectable = true;
      CleanedDataset.push(element);
    });
    const canvasJson = {
      version: '6.7.0',
      objects: CleanedDataset,
    };
    console.log(canvasJson);

    this.canvas.loadFromJSON(canvasJson, () => {
      const allObjects = this.canvas.getObjects();

      allObjects.forEach((obj: any) => {
        obj.visible = true;
        obj.opacity = obj.opacity !== undefined ? obj.opacity : 1;
        obj.selectable = true;
        obj.evented = obj.evented !== undefined ? obj.evented : true;
        obj.setCoords();
      });

      this.canvas.requestRenderAll();
      setTimeout(() => {
        this.patchCanvaBackgroundImage(imageurl);
      });
    });
  }

  getData() {
    forkJoin({
      course: this.certificateService.getCertificateById(this.classId),
    }).subscribe((response: any) => {
      this.canvas.clear();
      this.canvaObjectsclone = response.course.elements;
      this.loadCanvaContent(response.course.image);
      this.course = response.course;
      this.certificateForm.patchValue({
        title: this.course.title,
      });
    });
  }
}

// getData() {
//   forkJoin({
//     course: this.certificateService.getCertificateById(this.classId),
//   }).subscribe((response: any) => {
//     console.log()
//     this.course = response.course;
//     let imageUrl = this.course.image;
//     imageUrl = imageUrl.replace(/\\/g, '/');
//     imageUrl = encodeURI(imageUrl);

//     this.certificateForm.patchValue({
//       title: this.course.title,
//     });
//     this.elements = this.course.elements || [];
//     this.setBackgroundImage(imageUrl);
//   });
// }
