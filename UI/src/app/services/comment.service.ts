import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Review } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseApiUrl: string = environment.baseApi;

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseApiUrl}/Comment/AllComments`);
  }

  getCommentsByItemId(itemId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseApiUrl}/Comment/${itemId}`);
  }

  addComment(itemId: number, comment: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseApiUrl}/Comment/AddComment/${itemId}`, comment);
  }
}


