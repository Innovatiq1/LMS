import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '@core/service/announcement.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BulletPointsPipe } from '@core/service/content.pipe';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  breadscrums = [
    {
      title: 'Announcement',
      items: ['Automation'],
      active: 'Announcement',
    },
  ];
  displayedColumns: string[] = [
    'Title',
    'Decription',
    'User Role',
    // 'Actions'
  ];
  dataSource: any;
  create = true;
  status = true;
  pageSizeArr = this.utils.pageSizeArr;
  totalItems: any;
  editUrl: any;
  isLoading = false;
  announcementData: any[] = [];
  isCreate = false;
  isView = false;



  onButtonClicked(card: any) {
    console.log('Button clicked for card:', card.title);
  }

  deleteAnnouncement(announcementId: any) {

    

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed){
        this.announcementService.deleteAnnouncement(announcementId).subscribe((res: any) => {
          Swal.fire({
            title: 'Successful',
            text: "Announcement deleted successfully",
            icon: 'success',
          });
    
          this.activatedRoute.queryParams.subscribe(params => {
            this.getAnnouncementList(params);
          });
          this.cdr.detectChanges();
        });
      }
    });
    

  }



  edit(id: any) {
    this.router.navigate(['/Announcement/edit/' + id]);
  }
  toggleList() {
    this.create = !this.create;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  constructor(private router: Router,
    public utils: UtilsService,
    private announcementService: AnnouncementService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private authenService: AuthenService

  ) {

  }
  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.getAnnouncementList(params);
    });
  }

  getAnnouncementList(filter: any) {
    this.announcementService.getAnnouncementList(filter).subscribe((res: { data: { data: any[]; }; totalRecords: number; }) => {
      this.isLoading = false;
      this.dataSource = res.data.data;
      let limit = filter.limit ? filter.limit : 10
      if (res.totalRecords <= limit || res.totalRecords <= 0) {

        this.isLoading = true;
      }
      this.cdr.detectChanges();


      console.log("res====", res.totalRecords);

      this.cdr.detectChanges();
    })
  }
   // export table data in excel file
   exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map((x: any) => ({
        'Title': x.subject,
        'Description': this.removeHtmlTags(x.details), // Remove HTML tags from description
        'Role': x.announcementFor,
    }));

    TableExportUtil.exportToExcel(exportData, 'Announcement-list');
}

removeHtmlTags(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Title', 'Description', 'Role']];

    // Function to remove HTML tags from a string
    const removeHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const data = this.dataSource.map((x: { subject: any; details: string; announcementFor: any; }) => [
        x.subject,
        removeHtmlTags(x.details), // Remove HTML tags from description
        x.announcementFor,
    ]);

    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

    (doc as any).autoTable({
        head: headers,
        body: data,
        startY: 20,
    });

    doc.save('Announcement-list.pdf');
}

}
