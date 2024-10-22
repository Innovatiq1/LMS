import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import { LogoService } from '../logo.service';
@Component({
  selector: 'app-settings-sidemenu',
  templateUrl: './settings-sidemenu.component.html',
  styleUrls: ['./settings-sidemenu.component.scss']
})
export class SettingsSidemenuComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Customize'],
      active: 'Settings sidemenu',
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
        sidemenu: this.formBuilder.array([])
      });
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
      actions: this.formBuilder.array([]),
      submenu: this.formBuilder.array([])
    });
  }

  createSidemenuwithoutSubmenu(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      id: [''],
      class:[],
      iconsrc: [''],
      actions: this.formBuilder.array([]),
      submenu: this.formBuilder.array([])
    });
  }

  createSubmenu(): FormGroup {
    return this.formBuilder.group({
      title: '',
      id:'',
      class:'',
      actions: this.formBuilder.array([]),
      submenu: this.formBuilder.array([])
    });
  }

  getSubmenu(submenuIndex: number): FormArray {
    return this.sidemenu.at(submenuIndex).get('submenu') as FormArray;
  }

  getData() {
    this.logoService.getSettingSidemenuById(this.sidemenuId).subscribe((response: any) => {
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
            class: menuItem.class
          });

          const actionsArray = newSidemenuGroup.get('actions') as FormArray;
          menuItem?.actions?.forEach((action: any) => {
            actionsArray.push(this.formBuilder.group({
              title: action?.title,
              id: action?.id,
              class:action?.class
            }));
          });

          const submenuArray = newSidemenuGroup.get('submenu') as FormArray;
          menuItem?.children?.forEach((submenus: any) => {
            const submenuGroup = this.createSubmenu();
            submenuGroup.patchValue({
              title: submenus?.title,
              id: submenus?.id,
              class: submenus?.class
            });
            const submenuActionsArray = submenuGroup.get('actions') as FormArray;
            submenus?.actions?.forEach((action: any) => {
              submenuActionsArray.push(this.formBuilder.group({
                title: action?.title,
                id: action?.id,
                class:action?.class
              }));
            });

            if (submenus.children && submenus.children.length > 0) {
              submenus?.children?.forEach((submenu: any) => {
                const subSubmenuGroup = this.createSubmenu();
                subSubmenuGroup.patchValue({
                  title: submenu?.title,
                  id: submenu?.id,
                  class: submenu?.class
                });

                const subsubmenuActionsArray = subSubmenuGroup.get('actions') as FormArray;
                submenu?.actions?.forEach((action: any) => {
                  subsubmenuActionsArray.push(this.formBuilder.group({
                    title: action?.title,
                    id: action?.id,
                    class:action?.class
                  }));
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
    this.uploadedImages[menuItemIndex] = imageName;
})
  }

  update() {
    if (this.sideMenuForm.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const payload = {
        MENU_LIST: this.sideMenuForm.value.sidemenu.map((menulist: any) => ({
          title: menulist.title,
          id: menulist.id,
          iconsrc: menulist.iconsrc,
          class: menulist.class,
          actions: menulist.actions,
          children: menulist.submenu.map((submenus: any) => ({
            title: submenus.title,
            id: submenus.id,
            class: submenus.class,
            actions: submenus.actions,
            children: submenus.submenu.map((submenu: any) => ({
              title: submenu.title,
              id: submenu.id,
              class: submenu.class,
              actions: submenu.actions
            }))
          }))
        })),
        id: this.sidemenuId,
        companyId: userId,
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
          this.logoService.updateSettingSidemenu(payload).subscribe(
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
    }
  }

}
