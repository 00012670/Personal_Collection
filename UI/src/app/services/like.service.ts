import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { UserIdentityService } from './user-identity.service';

@Injectable({
  providedIn: 'root'
})

export class LikeService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient, private userIdentityService: UserIdentityService) { }

  getCurrentUserId(): any {
    return this.userIdentityService.getUserId();
  }
  getLikes(itemId: number): Observable<number> {
    return this.http.get<number>(`${this.baseApiUrl}/Likes/GetLikes/${itemId}`);
  }

  hasLiked(userId: number, itemId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}/Likes/HasLiked/${userId}/${itemId}`);
  }

  addLike(itemId: number): Observable<any> {
    const userId = this.getCurrentUserId();
      return this.http.post<any>(`${this.baseApiUrl}/Likes/AddLike/${userId}/${itemId}`, {});
  }

  deleteLike(itemId: number): Observable<any> {
    const userId = this.getCurrentUserId();
      return this.http.delete<any>(`${this.baseApiUrl}/Likes/DeleteLike/${userId}/${itemId}`);
  }
}
