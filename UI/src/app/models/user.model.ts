import { UserLike } from "./like.model";

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  status: Status;
  role: Role;
  isSelected: boolean;
  userLikes?: UserLike[];
}

export enum Status {
  Active = 0,
  Blocked = 1
}

export enum Role {
  User = 0,
  Admin = 1
}
