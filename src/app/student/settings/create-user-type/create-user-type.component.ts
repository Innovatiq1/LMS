import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageSource } from '@core/enums/image-upload-source.enum';
import { CoursePaginationModel } from '@core/models/course.model';
import { MenuItemModel, UserType } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { AuthenService } from '@core/service/authen.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { LogoService } from 'app/student/settings/logo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user-type',
  templateUrl: './create-user-type.component.html',
  styleUrls: ['./create-user-type.component.scss'],
})
export class CreateUserTypeComponent {
  breadscrums = [
    {
      title: 'Accessibility',
      items: ['Users'],
      active: 'Accessibility',
    },
  ];

  submitted: boolean = false;
  isLoading = false;
  mode!: String;
  id: any;
  userTypeFormGroup!: FormGroup;
  userType!: UserType;
  documentList = [];
  authorImageList = [];
  imageSource = ImageSource;
  menu_items = [];
  isNext: boolean = false;
  isNext1: boolean = false;
  isEdit: boolean = false;
  dataSource!: MatTableDataSource<MenuItemModel>;
  dataSourceArray: MenuItemModel[] = [];

  settingsMenuDS!: MatTableDataSource<MenuItemModel>;
  settingsMenuDSArray: MenuItemModel[] = [];
  chilData: any[] = [];
  options: any[] = [];
  allMenus = {
    checked: false,
    indeterminate: false,
  };
  allSettingMenus = {
    checked: false,
    indeterminate: false,
  };
  displayedColumns: string[] = ['menu', 'subMenu'];
  editUrl!: boolean;
  typesList: any;
  coursePaginationModel: Partial<CoursePaginationModel>;
  paramId: any;
  type: any;
  admin: any;
  userTypeNames: any;
  data: any;
  isDelete = false;

  constructor(
    public router: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private route: Router,
    public utils: UtilsService,
    private formBuilder: FormBuilder,
    private logoService: LogoService, private userService: UserService,
    private authenService: AuthenService
  ) {
    this.initMenuItemsV2();
    this.initMenuItemsSettings();
    this.router.queryParams.subscribe((params) => {
      if (params['id']) {
        this.paramId = params['id'];
        this.isEdit = true;
        this.getUserTypeList();
      }
    });
    this.userTypeFormGroup = this.fb.group({
      typeName: ['', []],
    });
    this.coursePaginationModel = {};

    if (this.isEdit === true) {
      this.breadscrums = [
        {
          title: 'Accessibility',
          items: ['Users'],
          active: 'Accessibility',
        },
      ];
    }
  }
  getUserTypeList(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService
      .getUserTypeList({ allRows: true },userId)
      .subscribe(
        (response: any) => {

          this.typesList = response;
          this. data = this.typesList.find((id: any) => id._id === this.paramId);
          if (this.data) {
            this.type = this.data.typeName;
            this.userTypeFormGroup = this.fb.group({
              typeName: [
                { value: this.type ? this.type : null, disabled: !this.isEdit },
                [
                  Validators.required,
                  ...this.utils.validators.title,
                  ...this.utils.validators.noLeadingSpace,
                ],
              ],
            });
            this.populateCheckbox(this.data.menuItems)
            this.populateSettingsMenuCheckbox(this.data.settingsMenuItems)
          }

          this.cd.detectChanges();
        },
        (error) => {}
      );
  }

  populateCheckbox(menuItems: any[]){
   menuItems.forEach((element:any) => {
    if(element.checked){
      this.changeMenuChecked(element.checked, element.id);
    }else if(element.indeterminate&& element.children?.length){
      this.populateCheckbox(element.children);
    }else if(element.indeterminate&& element.actions?.length){
      this.populateCheckbox(element.actions);
    }
   });
  }

  populateSettingsMenuCheckbox(settingsMenuItems: any[]){
    settingsMenuItems.forEach((element:any) => {
     if(element.checked){
       this.changeSettingMenuChecked(element.checked, element.id);
     }else if(element.indeterminate&& element.children?.length){
       this.populateSettingsMenuCheckbox(element.children);
     }else if(element.indeterminate&& element.actions?.length){
      this.populateSettingsMenuCheckbox(element.actions);
    }
    });
   }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.route.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

   
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.dataSource = new MatTableDataSource<MenuItemModel>(
      this.dataSourceArray
    );
    this.settingsMenuDS = new MatTableDataSource<MenuItemModel>(
      this.settingsMenuDSArray
    );
    this.getAllUserTypes();
  }
  onSubmitForm() {
    this.submitted = true;
    this.userTypeFormGroup.markAllAsTouched();
    let formData = this.userTypeFormGroup.getRawValue();
    this.isLoading = true;
    let selectedMenuItems = [];
    selectedMenuItems = this.getCheckedItems(this.dataSourceArray).filter(
      (v: any) => v
    );
    formData.menuItems = selectedMenuItems;
    this.updateUserType(formData)
      .then((response: any) => {})
      .catch((e: any) => {});
  }

  onSubmitSettingMenuForm() {
    this.submitted = true;
    this.userTypeFormGroup.markAllAsTouched();
    let formData = this.userTypeFormGroup.getRawValue();
    this.isLoading = true;
    let selectedMenuItems = [];
    selectedMenuItems = this.getCheckedItems(this.settingsMenuDSArray).filter(
      (v: any) => v
    );
    formData.settingsMenuItems = selectedMenuItems;

    this.updateUserType(formData)
      .then((response: any) => {})
      .catch((e: any) => {});
  }

  updateUserType(obj: any): any {
    return new Promise((resolve, reject) => {
      if (this.isEdit === false) {
        let formData = this.userTypeFormGroup.getRawValue();
        let typeName = formData.typeName;
        this.adminService
          .getUserTypeList({ ...this.coursePaginationModel })
          .subscribe((response: any) => {
            let userTypes = response.docs.filter(
              (item: { typeName: any }) => item.typeName === typeName
            );
            this.paramId = userTypes[0].id;

            Swal.fire({
              title: 'Are you sure?',
              text: 'You want to update this Module!',
              icon: 'warning',
              confirmButtonText: 'Yes',
              showCancelButton: true,
              cancelButtonColor: '#d33',
            }).then((result) => {
              if (result.isConfirmed) {
                this.adminService.updateUserType(obj, this.paramId).subscribe(
                  (response: unknown) => {
                    Swal.fire({
                      title: 'Successful',
                      text: 'Module added succesfully',
                      icon: 'success',
                    });
                    resolve(response);
                    this.route.navigate(['/student/settings/user-type']);
                  },

                  (error: { message: any; error: any }) => {
                    this.isLoading = false;
                    Swal.fire(
                      'Failed to update Role',
                      error.message || error.error,
                      'error'
                    );
                    reject(error);
                  }
                );
              }
            });
          });
      } else if (this.isEdit === true) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to update this Module!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.adminService.updateUserType(obj, this.paramId).subscribe(
              (response: unknown) => {
                this.isLoading = false;
                if (this.isEdit === true) {
                  Swal.fire({
                    title: 'Successful',
                    text: 'Module updated succesfully',
                    icon: 'success',
                  }).then(() => {
                    window.location.reload();
                  });
                }
                resolve(response);
                this.route.navigate(['/student/settings/user-type']);
              },
              (error: { message: any; error: any }) => {
                this.isLoading = false;
                Swal.fire(
                  'Failed to update Role',
                  error.message || error.error,
                  'error'
                );
                reject(error);
              }
            );
          }
        });
      }
    });
  }
  getAllUserTypes(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ allRows: true },userId).subscribe(
      (response: any) => {
        this.userTypeNames = response;
      },
      (error) => {}
    );
  }

  initMenuItemsV2() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.logoService.getSidemenu(userId).subscribe((response: any) => {
      let MENU_LIST = response.data.docs[0].MENU_LIST;
      console.log(MENU_LIST)
      const items = this.convertToMenuV2(MENU_LIST, this.userType?.menuItems);
      items?.forEach((item, index) => {
        if (!this.dataSourceArray.some((v) => v.id === item.id))
          this.dataSourceArray.push(item);
      });
      this.dataSource = new MatTableDataSource<MenuItemModel>(
        this.dataSourceArray
      );
      if (this.isEdit) {
        this.getUserTypeList();
      }

      this.cd.detectChanges();
    });
  }

  initMenuItemsSettings() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.logoService.getSettingsSidemenu(userId).subscribe((response: any) => {
      let MENU_LIST = response.data.docs[0].MENU_LIST;
      const items = this.convertToMenuV2(MENU_LIST, this.userType?.settingsMenuItems);
      items?.forEach((item, index) => {
        if (!this.settingsMenuDSArray.some((v) => v.id === item.id))
          this.settingsMenuDSArray.push(item);
      });
      this.settingsMenuDS = new MatTableDataSource<MenuItemModel>(
        this.settingsMenuDSArray
      );
      if (this.isEdit) {
        this.getUserTypeList();
      }

      this.cd.detectChanges();
    });
  }

  updateMenuItem(item: { checked: any; id: any; children: any[]; actions: any[] }) {
    if (typeof item === 'object' && item.checked) {
      this.changeMenuChecked(item.checked, item.id);
    }
    if (item?.children?.length) {
      item.children.forEach((element: any) => {
        this.updateMenuItem(element);
      });
    }
    if (item?.actions?.length) {
      item.actions.forEach((element: any) => {
        this.updateMenuItem(element);
      });
    }
    
  }

  updateSettingMenuItem(item: { checked: any; id: any; children: any[]; actions: any[] }) {
    if (typeof item === 'object' && item.checked) {
      this.changeSettingMenuChecked(item.checked, item.id);
    }
    if (item?.children?.length) {
      item.children.forEach((element: any) => {
        this.updateSettingMenuItem(element);
      });
    }
    if (item?.actions?.length) {
      item.actions.forEach((element: any) => {
        this.updateSettingMenuItem(element);
      });
    }
  }

  checkChecked(items: any[], id: string) {
    return items?.find((v) => v.id === id);
  }

  convertToMenuV2(obj: any[], value: any): MenuItemModel[] {
    return obj.map((v) => {
      const menu_item = this.checkChecked(value, v?.id);
      const children =
        v?.children && v?.children.length
          ? this.convertToMenuV2(v.children, menu_item?.children)
          : [];
          const actions =
      v?.actions && v?.actions.length
        ? v.actions.map((action: any) => {
            const actionChecked = this.checkChecked(
              menu_item?.actions,
              action.id
            );
            return {
              title: action.title,
              id: action.id,
              checked: actionChecked?.checked || false,
              indeterminate: actionChecked?.indeterminate || false,
              isLeaf: true,
              isAction: true,
            };
          })
        : [];
      const defaultCheck = this.checkChecked(value, v.id);
      let res: any = {
        title: v?.title,
        id: v?.id,
        children: children,
        actions: actions,
        isAction: false,
        checked: defaultCheck?.checked || false,
        indeterminate: defaultCheck?.indeterminate || false,
        icon: v?.iconsrc,
        class: v?.class,
      };
      if (children && children.length) {
        res = {
          ...res,
          children,
          isAction: false,
        };
        res.children = res.children.map((c: any) => ({
          ...c,
          isLeaf: true,
          isAction: false,
        }));
      }
      if (actions && actions.length) {
        res.actions = res.actions.map((a: any) => ({
          ...a,
          isLeaf: true,
          isAction: true,
        }));
      }
      return res;
    });
  }

  changeMenuChecked(checked?: any, id?: any) {
    this.dataSourceArray = this.setChecked(this.dataSourceArray, {
      menu_id: id,
      checked,
    });
    const indeterminate = this.dataSourceArray.some((v) => !v.checked);
    this.allMenus = {
      checked: indeterminate ? false : checked,
      indeterminate,
    };
    this.dataSource = new MatTableDataSource<MenuItemModel>(
      this.dataSourceArray
    );
    this.cd.detectChanges();
  }

  changeSettingMenuChecked(checked?: any, id?: any) {
    this.settingsMenuDSArray = this.setChecked(this.settingsMenuDSArray, {
      menu_id: id,
      checked,
    });
    const indeterminate = this.settingsMenuDSArray.some((v) => !v.checked);
    this.allSettingMenus = {
      checked: indeterminate ? false : checked,
      indeterminate,
    };
    this.settingsMenuDS = new MatTableDataSource<MenuItemModel>(
      this.settingsMenuDSArray
    );
    this.cd.detectChanges();
  }
  setChecked(
    obj: any[],
    data: { isAllCheck?: any; checked: any; menu_id?: any },
    parent?: { indeterminate: any; checked: boolean } | undefined
  ) {
    const { menu_id, checked, isAllCheck } = data;
    return obj.map((v) => {
      let res: any = {
        ...v,
      };
      let menuItemChecked = v.checked || false;
      if (v.id === menu_id || isAllCheck) {
        menuItemChecked = checked;
        res = {
          ...res,
          checked: menuItemChecked,
          indeterminate: false,
        };
      } else if (v?.isLeaf && !parent?.indeterminate) {
        menuItemChecked = parent?.checked || false;
      }
      res = {
        ...res,
        checked: menuItemChecked,
      };
      const children =
        v?.children && v?.children.length
          ? this.setChecked(v.children, { menu_id, checked }, res)
          : [];
        
      if (children && children.length) {
        res = {
          ...res,
          children,
        };
       
        const anyChildUnChecked = children.some(
          (child: { checked: any }) => !child.checked
        );
        const anyChildChecked = children.some(
          (child: { checked: any }) => child.checked
        );
        const anyChildIndeterminate = children.some(
          (child: { indeterminate: any }) => child.indeterminate
        );
        if (v.id != menu_id && !res.checked)
          res.checked = !anyChildUnChecked ? true : false;
        res.indeterminate =
          (anyChildChecked && anyChildUnChecked) || anyChildIndeterminate;
        if (res.indeterminate) res.checked = false;
      }
      const actions =
      v?.actions && v?.actions.length
        ? this.setChecked(v.actions, { menu_id, checked }, res)
        : [];
      if (actions && actions.length) {
        res = {
          ...res,
          actions,
        };
       
        const anyChildUnChecked = actions.some(
          (child: { checked: any }) => !child.checked
        );
        const anyChildChecked = actions.some(
          (child: { checked: any }) => child.checked
        );
        const anyChildIndeterminate = actions.some(
          (child: { indeterminate: any }) => child.indeterminate
        );
        if (v.id != menu_id && !res.checked)
          res.checked = !anyChildUnChecked ? true : false;
        res.indeterminate =
          (anyChildChecked && anyChildUnChecked) || anyChildIndeterminate;
        if (res.indeterminate) res.checked = false;
      }
      return res;
    });
  }

  getCheckedItems(obj: any) {
    return obj.map((item: { checked: any; children: string | any[], actions: string | any[], isAction: boolean }) => {
      if (item.checked) return item;
      if (item?.children?.length) {
        const children = this.getCheckedItems(item.children).filter(
          (v: any) => v
        );
        if (children.length)
          return {
            ...item,
            children,
          };
      }
      if (item?.actions?.length) {
        const actions = this.getCheckedItems(item.actions).filter(
          (v: any) => v
        );
        if (actions.length)
          return {
            ...item,
            actions,
          };
      }
      return null;
    });
  }

  get subcategories(): FormArray {
    return this.userTypeFormGroup.get('subcategories') as FormArray;
  }
  changeInActive(dataDetails: UserType): void {
    dataDetails.status = "inactive";
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: "Success",
          text: "Role moved to Inactive.",
          icon: "success",
        });
        this.getUserTypeList({});
        window.history.back();
      },
      (error) => {
        console.error(error, "result_error");
        Swal.fire({
          title: "Error",
          text: "Role attached to  User. Cannot Make Inactive.",
          icon: "error",
        });
        this.getUserTypeList({});

      }
    );
  }
  changeActive(dataDetails: UserType): void {
    dataDetails.status = "active";
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: "Success",
          text: "Role moved to Active.",
          icon: "success",
        });
        this.getUserTypeList({});
        window.history.back();
      },
      (error) => {
        console.error(error, "result_error");
      }
    );
  }
  delete(data: any) {
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
        this.userService.deleteUserType(data.id,data.typeName,data.companyId).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Role deleted successfully.',
            icon: 'success',
          });
          this.getUserTypeList({});
          window.history.back();
        },
        (error) => {
          Swal.fire({
            title: "Error",
            text: "Role attached to  User. Cannot Delete.",
            icon: "error",
          });
          this.getUserTypeList({});

        }
);
      }
    });

  }


}
