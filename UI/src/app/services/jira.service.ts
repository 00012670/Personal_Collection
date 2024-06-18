import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { IssueRequest } from '../models/jira';

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

  getIssuesByReporterEmail(email: string): Observable<any> {
    const url = `${this.baseApiUrl}/Jira/get-issues-by-reporter-email/${email}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  createaJiraTicket(request: IssueRequest): Observable<any> {
    const url = `${this.baseApiUrl}/Jira/create-jira-ticket`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, request, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}

