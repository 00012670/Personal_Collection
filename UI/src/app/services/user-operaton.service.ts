import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User, Status, Role } from './../models/user.model';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOperationsService {
  private selectedUsersState: User[] = [];

  constructor(private userService: UserService) { }

  updateUsersStatus(users: User[], status: Status): Observable<any> {
    return forkJoin(users.map(user => this.userService.setAccountStatus(user.userId, status)));
  }

  updateUsersRole(users: User[], role: Role): Observable<any> {
    return forkJoin(users.map(user => this.userService.setAccountRole(user.userId, role)));
  }

  updateUsersSelection(users: User[], isSelected: boolean): Observable<any> {
    return forkJoin(users.map(user => this.userService.setUserSelection(user.userId, isSelected)));
  }

  deleteUsers(users: User[]): Observable<any> {
    return this.userService.deleteUsers(users);
  }

  toggleUserSelection(user: User): void {
    user.isSelected = !user.isSelected;
  }

  getSelectedUsersState(): User[] {
    const storedState = localStorage.getItem('selectedUsersState');
    return storedState ? JSON.parse(storedState) : [];
  }

  storeSelectedUsersState(users: User[]): void {
    localStorage.setItem('selectedUsersState', JSON.stringify(users));
  }

  getSelectedUsers(users: User[]): User[] {
    return users.filter(user => user.isSelected);
  }
}
