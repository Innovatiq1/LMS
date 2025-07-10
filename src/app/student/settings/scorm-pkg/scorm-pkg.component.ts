import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scorm-pkg',
  templateUrl: './scorm-pkg.component.html',
  styleUrls: ['./scorm-pkg.component.scss']
})
export class ScormPkgComponent {

  breadscrums = [
    {
      title: 'SCORM Kit',
      items: ['Configuration'],
      active: 'SCORM Kit',
    },
  ];
  dataSource: any;
  isCreate:boolean=false;
  isEdit:boolean=false;


  constructor(private router: Router, private courseService: CourseService, public utils: UtilsService,public authenService: AuthenService) {
    this.dataSource = [];

  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllDropDowns();
  }

  onRowClick(id:string){
    this.router.navigate(['/student/settings/configuration/scorm-kit/update'], {
      queryParams: {
        id
      }
    });
  }



  update(data: any, field: any) {
    this.router.navigate(['/student/settings/configuration/meeting-platform/update'], {
      queryParams: {
        id: data._id,
        field,
      }
    });
  }

  getAllDropDowns() {
    var companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getScormKits(companyId).subscribe((res: any) => {
      this.dataSource = res.data;
    })
  }
  getOptions(dropDowns: any, field: string) {
    return dropDowns?.[field] || []
  }

  deleteDropDown(optionData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this SCORM Kit',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

}
