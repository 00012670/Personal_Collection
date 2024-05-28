import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Collection, CollectionCategory } from '../models/collection.model';

@Injectable({
  providedIn: 'root'
})

export class CollectionService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient) { }

  getCategory(category: CollectionCategory): string {
    const categories = {
      [CollectionCategory.Books]: 'Books',
      [CollectionCategory.Stamps]: 'Stamps',
      [CollectionCategory.Coins]: 'Coins',
      [CollectionCategory.Art]: 'Art',
      [CollectionCategory.Antiques]: 'Antiques',
      [CollectionCategory.Memorabilia]: 'Memorabilia',
      [CollectionCategory.Photographs]: 'Photographs',
      [CollectionCategory.Other]: 'Other'
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
