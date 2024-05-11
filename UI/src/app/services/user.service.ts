import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../environments/environment';
import { Role, Status, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/users`);
  }

  getRole(role: Role): string {
    const roles = {
      [Role.User]: 'User',
      [Role.Admin]: 'Admin',
    };
    return roles[role] || '';
  }

  getStatus(status: Status): string {
    const statuses = {
      [Status.Active]: 'Active',
      [Status.Blocked]: 'Blocked',
    };
    return statuses[status] || '';
  }

  deleteUsers(users: User[]): Observable<any> {
    const userIds = users.map(user => user.userId);
    return this.http.request('delete', `${this.baseApiUrl}/delete-users`, { body: userIds });
  }

  setAccountStatus(userId: number, status: Status): Observable<any> {
    const body = {
      status: this.getStatus(status),
    };
    return this.http.put(`${this.baseApiUrl}/${userId}/status`, body);
  }

  setAccountRole(userId: number, role: Role): Observable<any> {
    const body = {
      role: this.getRole(role),
    };
    return this.http.put(`${this.baseApiUrl}/${userId}/role`, body);
  }

}