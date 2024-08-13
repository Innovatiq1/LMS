import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import * as XLSX from 'xlsx'; // Import XLSX
import { renderAsync } from 'docx-preview'; // Import docx-preview

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit, OnDestroy {

  private pdfDoc: PDFDocumentProxy | null = null;
  fileExtension: string;
  allPagesRendered: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DocumentViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {
    this.fileExtension = this.getFileExtension(this.data.url);
    GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js';
  }

  ngOnInit(): void {
    this.loadDocument();
  }

  ngOnDestroy(): void {
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  loadDocument(): void {
    switch (this.fileExtension) {
      case 'pdf':
        this.loadPdf();
        break;
      case 'ppt':
      case 'pptx':
        this.loadPpt();
        break;
      case 'txt':
        this.loadTxt();
        break;
      case 'docx':
        this.loadDocx();
        break;
      case 'xlsx':
        this.loadXlsx();
        break;
      default:
        console.error('Unsupported file type');
    }
  }

  loadPdf(pdfUrl: string = this.data.url): void {
    getDocument(pdfUrl).promise.then(pdfDoc => {
      this.pdfDoc = pdfDoc;
      this.renderAllPages();
    }).catch(error => {
      console.error('Error loading PDF: ', error);
    });
  }

  // loadPpt(): void {
  //   const iframe = document.createElement('iframe');
  //  iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(this.data.url)}`;
  //   //  iframe.src=`https://view.officeapps.live.com/op/embed.aspx?src=${this.data.url}`;
    
  //  // iframe.src=this.data.url;
  //  iframe.width = '100%';
  //   iframe.height = '600px';
  //   iframe.onload = () => this.setupScrollListener();
  //   document.getElementById('pdf-viewer-container')?.appendChild(iframe);
  // }
  async loadPpt(): Promise<void> {
    try {
      const pdfUrl = await this.convertPptToPdf(this.data.url);
      if (pdfUrl) {
        this.loadPdf(pdfUrl);
      } else {
        console.error('PDF conversion failed');
      }
    } catch (error) {
      console.error('Error converting PPT to PDF: ', error);
    }
  }

  async convertPptToPdf(pptUrl: string): Promise<string> {
    console.log("pptURL==",pptUrl)
    try {
      const response = await fetch('http://localhost:3001/convert-to-pdf', {
        method: 'POST',
        body: JSON.stringify({ url: pptUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response==123",response)
      if (response.ok) {
        const { pdfUrl } = await response.json();
        return pdfUrl;
      } else {
        throw new Error('Failed to convert PPT to PDF');
      }
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  loadTxt(): void {
    fetch(this.data.url)
      .then(response => response.text())
      .then(data => {
        const textElement = document.createElement('div');
        textElement.innerText = data;
        document.getElementById('pdf-viewer-container')?.appendChild(textElement);
        this.setupScrollListener();
      })
      .catch(error => console.error('Error loading text file: ', error));
  }

  loadDocx(): void {
    fetch(this.data.url)
      .then(response => response.arrayBuffer())
      .then(data => {
        const container = document.getElementById('pdf-viewer-container');
        if (container) {
          renderAsync(data, container).then(() => {
            this.setupScrollListener();
          });
        }
      })
      .catch(error => console.error('Error loading DOCX file: ', error));
  }

  loadXlsx(): void {
    fetch(this.data.url)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const htmlString = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
        document.getElementById('pdf-viewer-container')!.innerHTML = htmlString;
        this.setupScrollListener();
      })
      .catch(error => console.error('Error loading Excel file: ', error));
  }

  renderAllPages(): void {
    if (this.pdfDoc) {
      let pagesRendered = 0;
      for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
        this.renderPage(pageNum).then(() => {
          pagesRendered++;
          if (pagesRendered === this.pdfDoc!.numPages) {
            this.setupScrollListener();
          }
        });
      }
    }
  }

  async renderPage(pageNumber: number): Promise<void> {
    if (this.pdfDoc) {
      try {
        const page = await this.pdfDoc.getPage(pageNumber);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          document.getElementById('pdf-viewer-container')?.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport
          };
          await page.render(renderContext).promise;
        }
      } catch (error) {
        console.error('Error rendering PDF page: ', error);
      }
    }
  }

  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.allPagesRendered = true; // User has scrolled to the bottom
    }
  }

  setupScrollListener(): void {
    const container = document.getElementById('pdf-viewer-container');
    if (container) {
      container.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onCheckboxChange(event: any): void {
    if (event.checked) {
      console.log('completed');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
