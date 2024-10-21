import { formatDate } from '@angular/common';
export class Students {
  id: number;
  img: string;
  name: string;
  last_name: string;
  email: string;
  joiningDate: string;
  gender: string;
  mobile: string;
  department: string;
  rollNo: string;
  parentsPhone:string;
  parentsNmae:string;
  avatar:string;
  address:string;
  data:any;
  docs:any;
  isLogin:boolean;
  country_name!:string;
  education!: string;
  role!: string;
  Active!:string;

  constructor(students: Students) {
    {
      this.id = students.id || this.getRandomID();
      this.img = students.img || 'assets/images/user/user1.jpg';
      this.name = students.name || '';
      this.email = students.email || '';
      this.joiningDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.gender = students.gender || '';
      this.mobile = students.mobile || '';
      this.department = students.department || '';
      this.rollNo = students.rollNo || '';
      this.parentsPhone = students.parentsPhone || '',
      this.parentsNmae = students.parentsNmae || '',
      this.avatar = students.avatar || '',
      this.address = students.address || '',
      this.isLogin = students.isLogin
      this.data = students.data || [];
      this.last_name = students.last_name || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
