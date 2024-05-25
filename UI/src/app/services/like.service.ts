import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LikeService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient) { }


  getLikes(collectionId: number): Observable<number> {
    return this.http.get<number>(`${this.baseApiUrl}/Likes/GetLikes/${collectionId}`);
  }

  hasLiked(userId: number, collectionId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}/Likes/HasLiked/${userId}/${collectionId}`);
  }

  addLike(userId: number, collectionId: number): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Likes/AddLike/${userId}/${collectionId}`, {});
  }

  deleteLike(userId: number, collectionId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Likes/DeleteLike/${userId}/${collectionId}`);
  }
}
