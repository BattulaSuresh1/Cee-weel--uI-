import { Role } from "./roles";

export interface User {
    id?:number;
    username: string;
    password: string;
    token?: string;
    role: Role;
}




export enum RoleName{
    SuperAdmin = 'Super Admin',
    OrganizationAdmin = 'Organization Admin',
    User = 'Employee',
}

export interface IBreadCrumb {
label: string;
url: string;
}