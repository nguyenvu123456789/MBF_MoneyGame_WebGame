export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  msisdn? :number;
  roleId?: number;
  roleName?: string;
  email?: string;
  modifiedAt?: string ;
  active?: boolean;
}
