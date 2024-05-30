import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Collection, CollectionCategory } from '../models/collection.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class CollectionService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient, private translate: TranslateService) { }

  getCategory(category: CollectionCategory): string {
    const categories = {
      [CollectionCategory.Books]: this.translate.instant('Books'),
      [CollectionCategory.Stamps]: this.translate.instant('Stamps'),
      [CollectionCategory.Coins]: this.translate.instant('Coins'),
      [CollectionCategory.Art]: this.translate.instant('Art'),
      [CollectionCategory.Antiques]: this.translate.instant('Antiques'),
      [CollectionCategory.Memorabilia]: this.translate.instant('Memorabilia'),
      [CollectionCategory.Photographs]: this.translate.instant('Photographs'),
      [CollectionCategory.Other]: this.translate.instant('Other')
    };
    return categories[category] || '';
  }

  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.baseApiUrl}/Collections/GetCollections`);
  }

  getCollectionsByUser(userId: number): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.baseApiUrl}/Collections/GetCollectionsByUser/${userId}`);
  }

  getCollection(collectionId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/Collections/GetCollection/${collectionId}`);
  }

  createCollection(collection: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/Collections/CreateCollection`, collection);
  }

  editCollection(id: number, collection: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/Collections/EditCollection/${id}`, collection);
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/Collections/DeleteCollection/${id}`);
  }
}
