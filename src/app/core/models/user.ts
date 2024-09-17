import { Role } from './role';

export class User {
  name!: string;
  id!: any;
  img!: string;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: Role;
  token!: string;
}
