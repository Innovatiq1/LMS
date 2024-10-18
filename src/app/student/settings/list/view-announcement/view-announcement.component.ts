import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '@core/service/announcement.service';
import { AuthenService } from '@core/service/authen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-announcement',
  templateUrl: './view-announcement.component.html',
  styleUrls: ['./view-announcement.component.scss']
})
export class ViewAnnouncementComponent {
  breadcrumbs:any[] = []

  aboutData1!: any;
  subscribeParams: any;
  departmentId: any;
  id?: number;
  isEdit = false;
  isDelete = false;
  storedItems: string | null;
  
  constructor(
    private activatedRoute:ActivatedRoute,
    private announcementService: AnnouncementService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenService: AuthenService
  ) {
    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadcrumbs = [
       {
         title: '', 
         items: [this.storedItems],  
         active: 'View Announcement ',  
       },
     ];
   }
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.departmentId = params.id;
    });
  }
  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
      let urlPath = this.router.url.split('/');
      const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
      const childId =  urlPath[urlPath.length - 3];
      let parentData = roleDetails.filter((item: any) => item.id == parentId);
      let childData = parentData[0].children.filter((item: any) => item.id == childId);
      let actions = childData[0].actions
      let editAction = actions.filter((item:any) => item.title == 'Edit')
      let deleteAction = actions.filter((item:any) => item.title == 'Delete')

      if(editAction.length >0){
        this.isEdit = true;
      }
      if(deleteAction.length >0){
        this.isDelete = true;
      }
    this.loadData()
  }

  loadData(){
  this.announcementService.getAnnouncementById(this.departmentId).subscribe((response:any)=>{
    this.aboutData1 = response.data.data;
   

  })
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
          this.loadData();
          window.history.back();
        });
        this.cdr.detectChanges();
      });
    }
  });
  

}

}
