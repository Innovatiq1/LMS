import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import { LogoService } from '../logo.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Sidemenu'],
      active: 'Cutomization',
    },
  ];
  sideMenuForm!: FormGroup;
  sidemenuId!: string;
  subscribeParams: any;
  res: any;
  iconsrc: any;
  uploadedImage: any;
  uploaded: any;
  thumbnail: any;
  uploadedImages: string[] = [];  
 
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private logoService: LogoService,
    private cdr: ChangeDetectorRef,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,) {
      this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
        this.sidemenuId = params.id;
      });
    }

    
  ngOnInit() {
    this.sideMenuForm = this.formBuilder.group({
      // title: ['', [Validators.required]],
      sidemenu: this.formBuilder.array([
        // this.createSidemenu()
      ])
      
      
    });
    console.log("sidemenu",this.sideMenuForm)
    this.getData();
  }
  get sidemenu(): FormArray {
    return this.sideMenuForm.get('sidemenu') as FormArray;
  }
  addSidemenu() {
    this.sidemenu.push(this.createSidemenu());
    this.cdr.detectChanges();
  }

  createSidemenu(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      id: [''],
      iconsrc: [''],
      class: [''],
      submenu: this.formBuilder.array([
        // this.createSubmenu(),
        // this.createOption()
      ])
    });
  }
  createSidemenuwithoutSubmenu(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      id: [''],
      class:[],
      iconsrc: [''],
      submenu: this.formBuilder.array([
       
        // this.createOption()
        
      ])
    });
  }

  get sidemenu1(): FormArray {
    return this.sideMenuForm.get('sidemenu1') as FormArray;
  }
  // addSubmenu(submenuIndex: number) {
  //   const submenu = this.getSubmenu(submenuIndex);
  //   submenu.push(this.createSubmenu());
  // }
  
  createSubmenu(): FormGroup {
    return this.formBuilder.group({
      title: '',
      id:'',
      class:'',
    });
  }

  
  getSubmenu(submenuIndex: number): FormArray {
    return this.sidemenu.at(submenuIndex).get('submenu') as FormArray;
  }

  getData(){
    this.logoService.getSidemenuById(this.sidemenuId).subscribe((response: any) => {
      const sidemenuArray = this.sideMenuForm.get('sidemenu') as FormArray;
      response.MENU_LIST.forEach((menuItem: any, i: number) => {
        if (menuItem.title.trim() !== '') {
        const newSidemenuGroup = this.createSidemenuwithoutSubmenu(); 
        const uploadedImageLink = menuItem.iconsrc; 
        const imageName = uploadedImageLink ? uploadedImageLink.split('/').pop()?.split('\\').pop() : null;
        this.uploadedImages[i] = imageName;
        newSidemenuGroup.patchValue({
        title: menuItem.title,
        id: menuItem.id,
        iconsrc: uploadedImageLink,
        class:menuItem.class
         });
         const submenuArray = newSidemenuGroup.get('submenu') as FormArray;
         menuItem.children.forEach((submenus: any) => {
             const submenuGroup = this.formBuilder.group({
                 title: submenus.title,
                 id: submenus.id,
                 class:submenus.class,
                 submenu: this.formBuilder.array([]) 
             });
         
             if (submenus.children && submenus.children.length > 0) {
                 submenus.children.forEach((submenu: any) => {
                     const subSubmenuGroup = this.formBuilder.group({
                         title: submenu.title,
                         id: submenu.id,
                         class:submenu.class
                     });
                     (submenuGroup.get('submenu') as FormArray).push(subSubmenuGroup);
                 });
             }
         
             submenuArray.push(submenuGroup);
         });
         
         sidemenuArray.push(newSidemenuGroup);
        }
      })
    })
  }
  // submenuArray1?.push(
  //   this.formBuilder.group({
  //        title: submenus.title,
  //        id: submenus.id,
  //        })
  //     );
  onFileUpload(event: any, menuItemIndex: number) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) => {
        const uploadedImageLink = data?.data?.thumbnail;
        const imageName = uploadedImageLink.split('/').pop()?.split('\\').pop();
        const menuItemControl = this.sidemenu?.at(menuItemIndex);
    menuItemControl.setValue({
      ...menuItemControl.value,
      iconsrc: uploadedImageLink,
    });
    // Update the uploaded image name or URL for display
    this.uploadedImages[menuItemIndex] = imageName;
   
    // this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) => {
    //     const uploadedImageLink = data?.data?.thumbnail;
    //     const imageName = uploadedImageLink.split('/').pop()?.split('\\').pop();
    //     this.uploadedImages[menuItemIndex] = imageName;
    //     const menuItemControl = this.sidemenu?.at(menuItemIndex);
    //     menuItemControl.patchValue({
    //       iconsrc: uploadedImageLink,
    //     });
    // })
})
  }

  // onFileUpload(event:any,menuItemIndex:number) {
  //   const file = event.target.files[0];
  //   this.thumbnail = file
  //   const formData = new FormData();
  //   formData.append('files', this.thumbnail);
  //   this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) =>{
  //   const uploadedImageLink = data?.data?.thumbnail;
  //   this.uploaded=uploadedImageLink.split('/')
  //   let image  = this.uploaded.pop();
  //   this.uploaded= image.split('\\');
  //   this.uploadedImage = this.uploaded.pop();
  //   const menuItemControl = this.sidemenu?.at(menuItemIndex);
  //   menuItemControl.patchValue({
  //       iconsrc: uploadedImageLink
  //   });    
  // })
  
  // }
  update() {
    if (this.sideMenuForm.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            const payload = {
        MENU_LIST: this.sideMenuForm.value.sidemenu.map((menulist: any) => ({
          title: menulist.title,
          id: menulist.id,
          iconsrc: menulist.iconsrc,
          class:menulist.class,
          children: menulist.submenu.map((submenus: any) => ({
            title: submenus.title,
            id: submenus.id,
            class:submenus.class,
            children: submenus.submenu.map((submenu: any) => ({
              title: submenu.title,
              id: submenu.id,
              
              class:submenu.class
            }))
          }))
        })),
        id: this.sidemenuId,
        companyId:userId,

      };
      
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
     
        if (result.isConfirmed) {
         
          this.logoService.updateSidemenu(payload).subscribe(
            (res: any) => {
             
              Swal.fire({
                title: 'Successful',
                text: 'Sidemenu Updated successfully',
                icon: 'success',
              });
             window.history.back();
            },
            (err: any) => {
              console.error("Failed to update sidemenu", err);
              Swal.fire(
                'Failed to update sidemenu',
                'error'
              );
            }
          );
        }
      });
    } else {
      
    }
  }
  
 
}
