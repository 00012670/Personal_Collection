import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User, Status, Role } from './../models/user.model';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOperationsService {
  constructor(private userService: UserService) {}

  updateUsersStatus(users: User[], status: Status): Observable<any> {
    const requests = users.map(user => this.userService.setAccountStatus(user.userId, status));
    return forkJoin(requests);
  }

  updateUsersRole(users: User[], role: Role): Observable<any> {
    const requests = users.map(user => this.userService.setAccountRole(user.userId, role));
    return forkJoin(requests);
  }

  deleteUsers(users: User[]): Observable<any> {
    return this.userService.deleteUsers(users);
  }
}
