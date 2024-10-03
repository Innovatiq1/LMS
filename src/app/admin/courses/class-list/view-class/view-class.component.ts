import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Course Class'],
      active: 'View Course Class',
    },
  ];
  classDataById: any;
  classData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  courseId: any;
  response: any;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  commonRoles: any;
  edit = false;
  isDelete = false;
  isZoomMeetingFormVisible: boolean = false;
  duration: string = '';
  constructor(public _classService: ClassService,private _router: Router, private activatedRoute: ActivatedRoute,private authenService: AuthenService) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      
      this.courseId = params.id;

      
    });
  }

  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this._router.url.split('/');
    const parentId = urlPath[urlPath.length - 4];
    const childId =  urlPath[urlPath.length - 3];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

    if(editAction.length >0){
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.commonRoles = AppConstants
    this.getClassList();
    if (this.courseId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.courseId = params.id;
        this.getCategoryByID(this.courseId);
      });
    }
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE || AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
    }
  }

  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this._classService
      .getClassListWithPagination({ ...this.coursePaginationModel },userId)
      .subscribe(
        (response) => {
          
          if (response.data) {
            this.classData = response.data.docs;
          }
        },
        (error) => {
          
        }
      );
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
     this._classService.getClassById(id).subscribe((response: any) => {
      this.classDataById = response?._id;
      this.response = response;
      console.log("data",this.response);
    });
  }
  editClass(id:string){
    this._router.navigate([`admin/courses/create-class`], { queryParams: {id: id}});
  }
  delete(id: string) {
    
    this._classService.getClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });

      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this Class?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          if (matchingClasses.length > 0) {
            Swal.fire({
              title: 'Error',
              text: 'Class have been registered . Cannot delete.',
              icon: 'error',
            });
            return;
          }
          this._classService.deleteClass(id).subscribe(() => {
            Swal.fire({
              title: 'Success',
              text: 'Class deleted successfully.',
              icon: 'success',
            });
            this.getClassList();
            window.history.back();
          });
    }
    });

    });
  }

  copyToClipboard(text: string): void {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
          title: 'Success',
          text: 'Meeting URL copied to clipboard!',
          icon: 'success',
        });
      }).catch(err => {
        console.error('Error copying text: ', err);
      });
    } else {
      alert('No URL to copy!');
    }
  }

  updateDateTime(date: string, duration: string): void {
    
    // Validate that both date and duration are provided
    if (!date || !duration) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please choose both a date and a duration.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return; // Exit the function early if validation fails
    }
  
    // Show confirmation dialog before proceeding
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the meeting with the new date and duration?',
      icon: 'question',
      showCancelButton: true, // Show the cancel button
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true // Optional: reverse the position of buttons (Yes/No)
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, call the API to update the meeting
        this._classService.updateZoomMeetingForPurticularDays(date, this.classDataById, duration).subscribe({
          next: (response) => {
            // Handle successful response (e.g., show success message)
            Swal.fire({
              title: 'Success',
              text: 'Meeting updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error(err);
            // Handle error response
            Swal.fire({
              title: 'Error',
              text: 'There was an error updating the meeting. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user cancels, show a cancellation message
        Swal.fire({
          title: 'Cancelled',
          text: 'Your meeting update has been cancelled.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
  deleteDateTime(date: string): void {
    if (!date) {
        Swal.fire({
            title: 'Validation Error',
            text: 'Please choose a date.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return; // Exit the function early if validation fails
    }

    // Show confirmation prompt before deleting the meeting
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete the meeting for the selected date: ${date}? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms, call the service to delete the meeting
            this._classService.deleteZoomMeetingForPurticularDay(date, this.classDataById).subscribe({
                next: (response) => {
                    // Handle successful response (e.g., show success message)
                    Swal.fire({
                        title: 'Success',
                        text: 'Meeting deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                },
                error: (err) => {
                    console.error(err);
                    // Handle error response
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error deleting the meeting. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Handle the case when the user cancels the deletion
            Swal.fire({
                title: 'Cancelled',
                text: 'Your meeting is safe.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        }
    });
}
isUpdated: boolean = true;
toggleZoomMeetingForm(): void {
  this.isZoomMeetingFormVisible = !this.isZoomMeetingFormVisible;
  this.hideDurationField = false;
  this.isUpdated = !this.isUpdated;
}
zoomRecordings:string=''
getRecordedVideoLink(): void {
  this._classService.getClassRecordings(this.classDataById).subscribe({
    next: (response) => {
      if (response.success) {
        const recordingLinks = response.recordingLinks;

        // Create HTML links for each recording URL
        const linksHtml = recordingLinks
          .map((link:any, index:any) => `<a href="${link}" target="_blank">Recording ${index + 1}</a>`)
          .join('<br>');

        // Display the links in a SweetAlert pop-up
        Swal.fire({
          title: 'Available Recordings',
          html: linksHtml,
          icon: 'info',
          showCloseButton: true,
          confirmButtonText: 'Close'
        });
      }
    },
    error: (err) => {
      console.error('Error fetching recordings:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve the recordings. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
  }); 
}
hideDurationField: boolean = false;
toggleZoomMeetingFormDelete() {
  this.isZoomMeetingFormVisible = !this.isZoomMeetingFormVisible;
    this.hideDurationField = true;
}


}
