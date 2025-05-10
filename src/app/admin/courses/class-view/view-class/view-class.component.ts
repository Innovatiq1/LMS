import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss'],
})
export class ViewClassComponent {
  breadcrumbs: any[] = [];
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
  storedItems: string | null;
  totalMinutes: number | null = null;
  initialDateTime: Date | null = null;
  minDate: Date | null = null;
  maxDate: Date | null = null;
  occurrences: any[] = [];
  _meetingid: string = '';
  _endDateTime: string = '';
  _courseName!: string;
  loading = false;
  constructor(
    public _classService: ClassService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private authenService: AuthenService,
    private clipboard: Clipboard
  ) {
    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
      this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
      this.breadcrumbs = [
        {
          title: '',
          items: [this.storedItems],
          active: 'View Course Batch',
        },
      ];
    }
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      this.courseId = params.id;
    });
  }

  public filterDate = (d: any): boolean => {
    if (!d) return true;
    const ISTDate = new Date(d);
    const dateString = new Date(
      ISTDate.getTime() - ISTDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];
    const res = this.occurrences.some((v) => {
      const occDate = new Date(v.startTime).toISOString().split('T')[0];
      return occDate == dateString;
    });
    return res;
  };

  ngOnInit(): void {
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems;
    let urlPath = this._router.url.split('/');
    // console.log('url', urlPath);
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId = urlPath[urlPath.length - 3];
    // console.log('chilldd', childId);
    const subChildId = urlPath[urlPath.length - 2];

    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    // console.log('parentdata', parentData);
    let childData = parentData[0].children.filter(
      (item: any) => item.id == childId
    );
    // console.log('child', childData);

    // let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);

    let actions = childData[0].actions;
    let editAction = actions.filter((item: any) => item.title == 'Edit');
    let deleteAction = actions.filter((item: any) => item.title == 'Delete');

    if (editAction.length > 0) {
      this.edit = true;
    }
    if (deleteAction.length > 0) {
      this.isDelete = true;
    }
    this.commonRoles = AppConstants;
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
      .getClassListWithPagination({ ...this.coursePaginationModel }, userId)
      .subscribe(
        (response) => {
          if (response.data) {
            this.classData = response.data.docs;
          }
        },
        (error) => {}
      );
  }
  getCategories(id: string): void {
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string): void {
    this._classService.getClassById(id).subscribe((response: any) => {
      this.response = response;
      this.classDataById = response?._id;
      this._meetingid = response?.meetingId;
      this._courseName = response?.courseName + "-" + response?.couserCode;
      console.log('Fetched data:',  response?.meetingPlatform);
      this._endDateTime = response?.sessions[0]?.sessionEndDate;
   
      this.occurrences = this.response?.occurrences || [];

      if (
        this.response &&
        this.response.sessions &&
        this.response.sessions.length > 0
      ) {
        const session = this.response.sessions[0];

        if (session.sessionStartDate && session.sessionStartTime) {
          const [hours, minutes] = session.sessionStartTime
            .split(':')
            .map(Number);

          const sessionDate = new Date(session.sessionStartDate);

          if (!isNaN(sessionDate.getTime())) {
            sessionDate.setHours(hours);
            sessionDate.setMinutes(minutes);
            sessionDate.setSeconds(0);
            sessionDate.setMilliseconds(0);

            this.initialDateTime = sessionDate;
            this.minDate = sessionDate;
          } else {
            console.error('Invalid sessionStartDate format.');
          }
        } else {
          console.error('sessionStartDate or sessionStartTime not found.');
        }

        const sessionEndDate = session.sessionEndDate;
        const sessionEndTime = session.sessionEndTime;

        if (sessionEndDate && sessionEndTime) {
          const lastSessionDate = new Date(sessionEndDate);

          const [endHours, endMinutes] = sessionEndTime.split(':').map(Number);

          if (!isNaN(lastSessionDate.getTime())) {
            lastSessionDate.setHours(23, 59, 59, 999);

            this.maxDate = lastSessionDate;

            if (
              this.initialDateTime &&
              this.initialDateTime.toDateString() ===
                lastSessionDate.toDateString()
            ) {
              this.initialDateTime.setHours(endHours);
              this.initialDateTime.setMinutes(endMinutes);
              this.initialDateTime.setSeconds(0);
              this.initialDateTime.setMilliseconds(0);
              console.log(
                'Corrected the selected time for the last day:',
                this.initialDateTime
              );
            }
          } else {
            console.error('Invalid sessionEndDate format.');
          }
        } else {
          console.warn('sessionEndDate or sessionEndTime not found.');
        }
      } else {
        console.warn('Session data is not available.');
      }
    });
  }

  editClass(id: string) {
    this._router.navigate([`admin/courses/create-class`], {
      queryParams: { id: id },
    });
  }
  delete(id: string) {
    this._classService
      .getClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });

        Swal.fire({
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this Class?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
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
  back() {
    window.history.back();
  }

  copyToClipboard(text: string): void {
    if (text) {
      this.clipboard.copy(text);
      setTimeout(() => {
        Swal.fire({
          title: 'Success',
          text: 'Meeting URL copied to clipboard!',
          icon: 'success',
        });
      }, 2000);
    } else {
      alert('No URL to copy!');
    }
  }

  updateDateTime(
    date: string,
    duration: string,
    meetingPlatform: string
  ): void {
    if (!date || !duration) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please choose both a date and a duration.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the meeting with the new date and duration?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update your meeting.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        if (meetingPlatform == 'zoom') {
          this._classService
            .updateZoomMeetingForPurticularDays(
              date,
              this.classDataById,
              duration
            )
            .subscribe({
              next: (response) => {
                Swal.close();
                Swal.fire({
                  title: 'Success',
                  text: 'Meeting updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                }).then(() => {
                  window.location.reload();
                });
              },
              error: (err) => {
                console.error(err);
                Swal.close();
                Swal.fire({
                  title: 'Error',
                  text: 'There was an error updating the meeting. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              },
            });
        } else if (meetingPlatform == 'teams') {
          const dateString = date; 
          const startDate = new Date(dateString); 

          const startDateTime = startDate.toISOString();
          // const endDate = new Date(this._endDateTime).toISOString();
           
          console.log('Payload:', this._endDateTime);

          this._classService
            .updateTeamsMeetingForPurticularDays(
              startDateTime,
              this._endDateTime,
              this._meetingid
            )
            .subscribe({
              next: (response) => {
                Swal.close();
                Swal.fire({
                  title: 'Success',
                  text: 'Meeting updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                }).then(() => {
                  window.location.reload();
                });
              },
              error: (err) => {
                console.error(err);
                Swal.close();
                Swal.fire({
                  title: 'Error',
                  text: 'There was an error updating the meeting. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              },
            });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your meeting update has been cancelled.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  deleteDateTime(date: string, meetingPlatform: string): void {
    if (!date) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please choose a date.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const newDateTime = new Date(date);
    const formattedDate = newDateTime.toISOString().substring(0, 10);

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the meeting for the selected date: ${formattedDate}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete your meeting.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        if(meetingPlatform == 'zoom') {
          this._classService
          .deleteZoomMeetingForPurticularDay(date, this.classDataById)
          .subscribe({
            next: (response) => {
              Swal.close();
              Swal.fire({
                title: 'Success',
                text: 'Meeting deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                window.location.reload();
              });
            },
            error: (err) => {
              console.error(err);
              Swal.close();
              Swal.fire({
                title: 'Error',
                text: 'There was an error deleting the meeting. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
        } else if(meetingPlatform == 'teams'){
          this._classService
          .deleteTeamsMeetingForPurticularDay(this._meetingid)
          .subscribe({
            next: (response) => {
              Swal.close();
              Swal.fire({
                title: 'Success',
                text: 'Meeting deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                window.location.reload();
              });
            },
            error: (err) => {
              console.error(err);
              Swal.close();
              Swal.fire({
                title: 'Error',
                text: 'There was an error deleting the meeting. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your meeting is safe.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  zoomRecordings: string = '';
  getRecordedVideoLink(): void {
    this._classService.getClassRecordings(this.classDataById).subscribe({
      next: (response) => {
        const videoRecordings = response.recordingLinks.filter(
          (link: any) => link.file_type === 'MP4'
        );
        videoRecordings.sort((a: any, b: any) => {
          return (
            new Date(b.recording_start).getTime() -
            new Date(a.recording_start).getTime()
          );
        });

        if (videoRecordings.length > 0) {
          const linksHtml = videoRecordings
            .map((link: any) => {
              const date = new Date(link.recording_start).toLocaleDateString();
              return `<li><a href="${link.play_url}" target="_blank" style="color: #28a745;">Video Recording</a> - Recorded on ${date}</li>`;
            })
            .join('');

          Swal.fire({
            title: 'Available Video Recordings',
            html: `<ul style="list-style-type: none; padding-left: 0;">${linksHtml}</ul>`,
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: 'Close',
          });
        } else {
          Swal.fire({
            title: 'No Video Recordings Available',
            text: 'There are no video recordings for this class at the moment.',
            icon: 'info',
            confirmButtonText: 'Close',
          });
        }
      },
      error: (err) => {
        console.error('Error fetching recordings:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to retrieve the recordings. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      },
    });
  }
  isUpdateMode: boolean = false;
  isDeleteMode: boolean = false;
  toggleZoomMeetingForm(): void {
    if (this.isZoomMeetingFormVisible && this.isUpdateMode) {
      this.isZoomMeetingFormVisible = false;
      this.isUpdateMode = false;
    } else {
      this.isZoomMeetingFormVisible = true;
      this.isUpdateMode = true;
      this.isDeleteMode = false;
    }
  }

  toggleZoomMeetingFormDelete(): void {
    if (this.isZoomMeetingFormVisible && this.isDeleteMode) {
      this.isZoomMeetingFormVisible = false;
      this.isDeleteMode = false;
    } else {
      this.isZoomMeetingFormVisible = true;
      this.isDeleteMode = true;
      this.isUpdateMode = false;
    }
  }
  isDateExpired(sessionEndDate: string): boolean {
    if (!sessionEndDate) {
      return true;
    }
    const endDate = new Date(sessionEndDate);
    const today = new Date();
    return endDate < today;
  }

  onDurationChange() {
    const duration = this.duration;
    if (duration && duration.length === 5) {
      const [hours, minutes] = duration.split(':').map(Number);

      if (
        !isNaN(hours) &&
        !isNaN(minutes) &&
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59
      ) {
        this.totalMinutes = hours * 60 + minutes;
      } else {
        this.totalMinutes = null;
      }
    } else {
      this.totalMinutes = null;
    }
  }

  formatDuration() {
    let value = this.duration || '';

    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length <= 2) {
      this.duration = cleaned;
    } else {
      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      this.duration = `${hours}:${minutes}`;
    }
  }

  closeZoomMeetingForm() {
    this.isZoomMeetingFormVisible = false;
  }

  getTeamsRecording(icalUID: string) {
    this.loading = true;
    this._classService.getTeamsRecordings(icalUID).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.recordings?.length) {
          const recordingUrl = res.recordings[0].webUrl;
          window.open(recordingUrl, '_blank');
        } else {
          console.warn('Recording URL not found.');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching recording:', err);
      }
    });
  }
}
