import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BannersService } from '../banners.service';
import { CourseService } from '@core/service/course.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-s-banner-create',
  templateUrl: './s-banner-create.component.html',
  styleUrls: ['./s-banner-create.component.scss']
})
export class SBannerCreateComponent {
  breadscrums = [
    {
      title: 'Create Banner',
      items: ['Banner'],
      active: `Create ${AppConstants.STUDENT_ROLE} Banner`,
    },
  ];
  public addCusForm!: FormGroup;
  image_link: any;
  uploaded: any;
  uploadedImage: any;
  status = true;
  banner_for!: string;
  bannerList: any;
  thumbnail: any;
  commonRoles: any;
  constructor(private fb: FormBuilder,private courseService: CourseService,private bannerService :BannersService,public router:Router) {}
  public ngOnInit(): void {
    this.commonRoles = AppConstants
    this.addCusForm = this.fb.group({
      bannerFor: [`${AppConstants.STUDENT_ROLE} Banner`, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')] ],
      banner :['',Validators.required]

    });
  }
  closeDialog(): void {
    this.router.navigate(['student/banners/settings/student-banner-list'])
  }
  onSubmitClick():void {
    this.banner_for = this.addCusForm.value.bannerFor;
    if(this.addCusForm?.valid ){
       const formData = this.addCusForm.getRawValue()
       formData['imagePath']=this.image_link;
       formData['isActivated']= this.status

       Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create banner!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.bannerService.addBanner(formData).subscribe((response:any)=>{
          Swal.fire({
            title: 'Successful',
            text: "Banner created successfully",
            icon: 'success',
          });
          // this. closeDialog();
          this.router.navigate(['/admin/banners/student-banner-list'])
        },
        (err) => {
          Swal.fire(
            'Create banner failed',
            'error'
          );
        },
        () => {
        }
         );
      }
    });
       
   }
    else {
    }

  }


  FileUpload(event:any){
    // const file =event.target.files[0]
    // const formData = new FormData()
    // formData.append('files', file)
    // this.bannerService.uploadCourseThumbnail(formData).subscribe((response:any)=>{
    // this.image_link = response.image_link;
    // this.uploaded=this.image_link.split('/')
    // this.uploadedImage = this.uploaded.pop();
    // })
    const file = event.target.files[0];
  
    this.thumbnail = file
    const formData = new FormData();
    formData.append('files', this.thumbnail);
   this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) =>{
    this.image_link = data.data.thumbnail;
    this.uploaded=this.image_link.split('/')
    let image  = this.uploaded.pop();
    this.uploaded= image.split('\\');
    this.uploadedImage = this.uploaded.pop();
  })
  }

}
