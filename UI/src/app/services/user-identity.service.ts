import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserIdentityService {
  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  baseApi: string = environment.baseApi

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService) {
    const storedToken = localStorage.getItem('currentUser');
    if (storedToken) {
      const user = this.decodeToken(storedToken);
      if (user && user.role) {
        this.currentUser.next(user);
      }
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.error || 'Server Error');
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseApi}/Identity/register`, userObj)
      .pipe(catchError(this.errorHandler),
        tap((response) => {
          this.currentUser.next(response);
          localStorage.setItem('currentUser', JSON.stringify(response));
        }));
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseApi}/Identity/login`, loginObj)
      .pipe(catchError(this.errorHandler),
        tap((response) => {
          this.currentUser.next(response);
          localStorage.setItem('currentUser', JSON.stringify(response));
        }));
  }

  signOut() {
    localStorage.clear();
    this.currentUser.next(null);
    this.router.navigate(['login'])
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  decodeToken(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken);
    return decodedToken;
  }

  getUserId(): number | null {
    return this.currentUser.value?.nameid ? Number(this.currentUser.value.nameid) : null;
  }
}
