import { Component } from '@angular/core';
import { LogoService } from '../logo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logo-coutomzation',
  templateUrl: './logo-coutomzation.component.html',
  styleUrls: ['./logo-coutomzation.component.scss'],
})
export class LogoCoutomzationComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Customize'],
      active: 'Logo',
    },
  ];
  displayedColumns1: string[] = ['logo'];
  Logos: any;
  LogoForm!: FormGroup;
  logoImg: any;
  isLogo: boolean = false;
  logoFile: any;
  patchId!: string;
  upload: any;
  fileError: string = '';
  constructor(private logoService: LogoService, public fb: FormBuilder) {
    this.LogoForm = this.fb.group({
      title: [''],
      logo: [''],
    });
    // constructor
  }
  ngOnInit() {
    this.getLogo();
  }
  getLogo() {
    /* get all logos **/
    this.logoService.getLogo().subscribe((logo) => {
      this.Logos = logo?.data?.docs;
    });
  }
  /* get logo from HTML **/
  // onFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   this.logoFile = file;
  //   this.logoImg = this.logoFile.name;
  // }

  onFileUpload(event: any) {
    const file = event.target.files[0];
  this.fileError = ''
    if (!file) {
      this.fileError = 'Please select a file';
      return;
    }
  
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
    if (file.size > maxSizeInBytes) {
      this.fileError = `File size must not exceed ${maxSizeInMB}MB.`;
      return;
    }
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
  
    if (!allowedFormats.includes(file.type)) {
      this.fileError = `Allowed file formats are: .png, .jpeg, .jpg`;
      return;
    }
    this.logoFile = file;
    this.logoImg = this.logoFile.name;
  }

  /* when list was clicked, get log By Id & patch values  **/
  patchFile(id: string) {
    this.patchId = id;
    this.logoService.getLogoById(this.patchId).subscribe((res) => {
      try {
        if (res) {
          /* this.isLogo for showing and hiding of update section **/
          this.isLogo = true;
          this.logoImg = res.filename;
          this.LogoForm.patchValue({
            title: res?.title,
          });
        }
      } catch (err) {}
    });
  }
  cancel() {
    this.isLogo = false;
  }

  /* update logo api call **/

  updateLogo() {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this logo!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let formdata = new FormData();
        if(this.logoFile){
          formdata.append('files', this.logoFile);
        }
        let userId:any = localStorage.getItem('id');
        formdata.append('title', this.LogoForm.value.title);
        formdata.append('filename', this.logoImg);
        formdata.append('adminId',userId)
        this.logoService
          .updateLogo(this.patchId, formdata)
          .subscribe((data) => {
            if (data) {
              this.isLogo = false;
              this.getLogo();
              Swal.fire({
                title: 'Success',
                text: 'Logo Updated successfully.',
                icon: 'success',
                // confirmButtonColor: '#d33',
              });
            }
          });
      }
    });
  }
}
