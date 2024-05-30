import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, } from 'rxjs';
import { environment } from '../environments/environment';
import { Role, Status, User } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient, private translate: TranslateService) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/users`);
  }

  getRole(role: Role): string {
    const roles = {
      [Role.User]: this.translate.instant('User'),
      [Role.Admin]: this.translate.instant('Admin'),
    };
    return roles[role] || '';
  }

  getStatus(status: Status): string {
    const statuses = {
      [Status.Active]: this.translate.instant('Active'),
      [Status.Blocked]: this.translate.instant('Blocked'),
    };
    return statuses[status] || '';
  }

  deleteUsers(users: User[]): Observable<any> {
    const userIds = users.map(user => user.userId);
    return this.http.request('delete', `${this.baseApiUrl}/delete-users`, { body: userIds });
  }

  setAccountStatus(userId: number, status: Status): Observable<any> {
    const body = {
      status: status,
    };
    return this.http.put(`${this.baseApiUrl}/${userId}/status`, body);
  }

  setAccountRole(userId: number, role: Role): Observable<any> {
    const body = {
      role: role,
    };
    return this.http.put(`${this.baseApiUrl}/${userId}/role`, body);
  }

  setUserSelection(userId: number, isSelected: boolean): Observable<any> {
    const url = `${this.baseApiUrl}/${userId}/selection`;
    const body = { isSelected };
    return this.http.put(url, body);
  }
}
