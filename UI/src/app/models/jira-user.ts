export interface User {
  email: string;
  username: string;
  password?: string;
  displayName?: string;
  applicationRoles?: string[];
}
