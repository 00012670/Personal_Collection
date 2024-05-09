import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserIdentityService {

  baseApi: string = environment.baseApi
  private userPayload: any;

  constructor(
    private http: HttpClient,
  ) {
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.error || 'Server Error');
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseApi}/Identity/register`, userObj)
      .pipe(catchError(this.errorHandler));
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseApi}/Identity/login`, loginObj)
      .pipe(catchError(this.errorHandler));
  }
}
