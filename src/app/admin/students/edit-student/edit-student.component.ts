import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '@core/models/user.model';
import Swal from 'sweetalert2';
import { StudentsService } from '../students.service';
@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss'],
})

export class EditStudentComponent {
  fileName: any;
  studentId: any;
  stdForm: UntypedFormGroup ;
  formdata = {
    first: 'Pooja',
    last: 'Sarma',
    rollNo: '12',
    gender: 'male',
    email: 'test@example.com',
    mobile: '123456789',
    rDate: '2020-02-05T14:22:18Z',
    department: 'mathematics',
    bGroup: 'O+',
    dob: '1987-02-17T14:22:18Z',
    parentName: 'Sanjay Shukla',
    parentNo: '1234567890',
    address: '101, Elanxa, New Yourk',
    uploadFile: '',
  };
  breadscrums = [
    {
      title: 'Edit Student',
      items: ['Users'],
      active: 'Edit Student',
    },
  ];
  editData: any ;
  constructor(private fb: UntypedFormBuilder, private studentService: StudentsService, private router:Router,private activatedRoute: ActivatedRoute,) {


    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.studentId = params.id;
      this.patchValues(this.studentId)
      // console.log("id",this.userId)

    });
    // this.stdForm = this.createContactForm();

    this.stdForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last_name: [''],
      rollNo: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', ],
      conformPassword: ['',],
      qualification: [''],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      parentsName: ['', [Validators.required]],
      parentsPhnoe: [''],
      dob: ['', [Validators.required]],
      joiningDate:['', [Validators.required]],
      education: [''],
      avatar: [''],
      blood_group: [''],
    });
  }
  // onSubmit() {
  //   console.log('Form Value', this.stdForm.value);
  // }
  // createContactForm(): UntypedFormGroup {

  //  console.log("lk",this.editData)
  //   return this.fb.group({
  //     name: [this.editData.name,
  //       [Validators.required, Validators.pattern('[a-zA-Z]+')],
  //     ],
  //     last: [this.formdata.last],
  //     rollNo: [this.formdata.rollNo],
  //     gender: [this.formdata.gender, [Validators.required]],
  //     mobile: [this.formdata.mobile, [Validators.required]],
  //     rDate: [this.formdata.rDate, [Validators.required]],
  //     email: [
  //       this.formdata.email,
  //       [Validators.required, Validators.email, Validators.minLength(5)],
  //     ],
  //     department: [this.formdata.department],
  //     parentName: [this.formdata.parentName, [Validators.required]],
  //     parentNo: [this.formdata.parentNo],
  //     dob: [this.formdata.dob, [Validators.required]],
  //     bGroup: [this.formdata.bGroup],
  //     address: [this.formdata.address],
  //     uploadFile: [this.formdata.uploadFile],
  //   });

  // }



  patchValues(id:string){
    this.studentService.getStudentById(this.studentId).subscribe(res => {
      this.editData = res;


      this.stdForm.patchValue({
        name: this.editData.name,
        last: this.editData.last_name,
        rollNo: this.editData.rollNo,
        gender: this.editData.gender,
        mobile: this.editData.mobile,
        joiningDate: this.editData.joiningDate,
        email: this.editData.email,
        department: this.editData.department,
        parentsName:this.editData.parentsName,
        parentsPhnoe: this.editData.parentsPhnoe,
        dob: this.editData.dob,
        education:this.editData.education,
        blood_group: this.editData.blood_group,
        address: this.editData.address,
        avatar: this.editData.avatar,
      })
     })
  }


  onSubmit() {
    if(this.stdForm.valid){
      // this.instructor.uploadVideo(this.files).subscribe(
      //   (response: any) => {
      //     const inputUrl = response.inputUrl;

          const userData: Student = this.stdForm.value;
          //this.commonService.setVideoId(videoId)

          //userData.avatar = inputUrl;
          userData.filename= this.fileName
          userData.type = "Student";
          userData.role = "Student";

          //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
          // this.currentVideoIds.push(videoId);
          this.updateInstructor(userData);

          Swal.close();
       // },

    }
  }
  private updateInstructor(userData: Student): void {
    this.studentService.updateStudent(this.studentId,userData).subscribe(
      () => {
        Swal.fire({
          title: "Successful",
          text: "Student update successfully",
          icon: "success",
        });
        //this.fileDropEl.nativeElement.value = "";
      this.stdForm.reset();
      //this.toggleList()
      this.router.navigateByUrl('/admin/teachers/all-teachers');
      },
      (error: { message: any; error: any; }) => {
        Swal.fire(
          "Failed to create course kit",
          error.message || error.error,
          "error"
        );
      }
    );
  }
}
