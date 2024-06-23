import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageSource } from '@core/enums/image-upload-source.enum';
import { CoursePaginationModel } from '@core/models/course.model';
import { MenuItemModel, UserType } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { MENU_LIST } from '@shared/menu-item';
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
      items: ['Module Access'],
      active: 'Create Module Access',
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
  chilData: any[] = [];
  options: any[] = [];
  allMenus = {
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
  submenuchildren: any[] = [];
  constructor(
    public router: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private route: Router,
    public utils: UtilsService,
    private formBuilder: FormBuilder,
    private logoService: LogoService,
    private userService: UserService
  ) {
    this.initMenuItemsV2();
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
          items: ['Module Access'],
          active: 'Edit Module Access',
        },
      ];
    }
  }
  getUserTypeList(filters?: any) {
    this.adminService
      .getUserTypeList({ ...this.coursePaginationModel })
      .subscribe(
        (response: any) => {
          this.typesList = response.docs;
          this.data = this.typesList.find((id: any) => id._id === this.paramId);
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

            this.data.menuItems.map((res: { id: any; checked: any }) => {
              this.changeMenuChecked(res.checked, res.id);
            });
          }

          this.cd.detectChanges();
        },
        (error) => {}
      );
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<MenuItemModel>(
      this.dataSourceArray
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

            // this.adminService.updateUserType(obj, this.paramId).subscribe(
            //   (response: unknown) => {
            //     Swal.fire({
            //       title: 'Successful',
            //       text: 'Module added succesfully',
            //       icon: 'success',
            //     });
            //     resolve(response);
            //     this.route.navigate(['/student/settings/user-type']);
            //   },
            //   (error: { message: any; error: any }) => {
            //     this.isLoading = false;
            //     Swal.fire(
            //       'Failed to update Role',
            //       error.message || error.error,
            //       'error'
            //     );
            //     reject(error);
            //   }
            // );
          });
      } else if (this.isEdit === true) {
        this.adminService.updateUserType(obj, this.paramId).subscribe(
          (response: unknown) => {
            this.isLoading = false;
            if (this.isEdit === true) {
              Swal.fire({
                title: 'Successful',
                text: 'Module updated succesfully',
                icon: 'success',
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
  getAllUserTypes(filters?: any) {
    this.adminService.getUserTypeList({ allRows: true }).subscribe(
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
      const items = this.convertToMenuV2(MENU_LIST, this.userType?.menuItems);
      items?.forEach((item, index) => {
        if (!this.dataSourceArray.some((v) => v.id === item.id))
          this.dataSourceArray.push(item);
      });
      this.dataSource = new MatTableDataSource<MenuItemModel>(
        this.dataSourceArray
      );

      console.log(this.dataSourceArray);
      if (this.isEdit) {
        this.getUserTypeList();
      }

      this.cd.detectChanges();
    });
  }

  clicked(item: any) {
    console.log('testinggg', item);
  }

  updateMenuItem(item: { checked: any; id: any; children: any[] }) {
    if (typeof item === 'object' && item.checked) {
      this.changeMenuChecked(item.checked, item.id);
    }
    if (item?.children?.length) {
      item.children.forEach((element: any) => {
        this.updateMenuItem(element);
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
      const defaultCheck = this.checkChecked(value, v.id);
      let res: any = {
        title: v?.title,
        id: v?.id,
        children: [],
        checked: defaultCheck?.checked || false,
        indeterminate: defaultCheck?.indeterminate || false,
        icon: v?.iconsrc,
        class: v?.class,
        isAction: false,
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
      if (v?.actions && v?.actions?.length) {
        const actionChild = v?.actions.map((action: any) => {
          const actionChecked = this.checkChecked(
            menu_item?.children,
            `${v.id}__${action.id}`
          );
          return {
            title: action.action_name,
            id: `${v.id}__${action.id}`,
            isAction: true,
            _id: action.id,
            isLeaf: true,
            checked: actionChecked?.checked || false,
            indeterminate: actionChecked?.indeterminate || false,
            icon: actionChecked?.iconsrc,
            class: actionChecked?.class,
          };
        });
        res = {
          ...res,
          children: actionChild,
        };
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

  // changeMenuCheckedSub(checked: boolean, id: number) {
  //   // Find the submenu item with the given ID
  //   const submenu = this.subMenuItems.find(item => item.id === id);
  //   if (submenu) {
  //     // Update the checked state of the submenu item
  //     submenu.checked = checked;
  //     // Implement your logic here to handle the checked state change
  //     console.log(`Submenu ${id} checked: ${checked}`);
  //   }
  // }
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
      return res;
    });
  }

  getCheckedItems(obj: any) {
    return obj.map((item: { checked: any; children: string | any[] }) => {
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
      return null;
    });
  }

  get subcategories(): FormArray {
    return this.userTypeFormGroup.get('subcategories') as FormArray;
  }
  changeInActive(dataDetails: UserType): void {
    dataDetails.status = 'inactive';
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'Role moved to Inactive.',
          icon: 'success',
        });
        this.getUserTypeList({});
        window.history.back();
      },
      (error) => {
        console.error(error, 'result_error');
        Swal.fire({
          title: 'Error',
          text: 'Role attached to  User. Cannot Make Inactive.',
          icon: 'error',
        });
        this.getUserTypeList({});
      }
    );
  }
  changeActive(dataDetails: UserType): void {
    dataDetails.status = 'active';
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'Role moved to Active.',
          icon: 'success',
        });
        this.getUserTypeList({});
        window.history.back();
      },
      (error) => {
        console.error(error, 'result_error');
      }
    );
  }
  delete(data: any) {
    console.log('data', data);

    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserType(data.id, data.typeName).subscribe(
          () => {
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
              title: 'Error',
              text: 'Role attached to  User. Cannot Delete.',
              icon: 'error',
            });
            this.getUserTypeList({});
          }
        );
      }
    });
  }
}
