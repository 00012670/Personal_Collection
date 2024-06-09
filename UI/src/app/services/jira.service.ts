import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Item } from '../models/item.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JiraService {
  baseApiUrl: string = environment.baseApi;

  constructor(private http: HttpClient) { }
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  createTicket(ticket: any): Observable<any> {
    const url = `${this.baseApiUrl}/Jira/create-jira-ticket`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, ticket, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: any): Observable<any> {
    const url = `${this.baseApiUrl}/create-user`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, user, { headers });
  }

  getUserTickets(userEmail: string): Observable<any> {
    const url = `${this.baseApiUrl}/get-user-tickets?email=${userEmail}`;
    return this.http.get(url);
  }

}