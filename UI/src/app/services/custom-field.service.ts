import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../environments/environment';
import { CustomField } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})

export class CustomFieldService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient) { }

  addCustomField(collectionId: number, customField: CustomField): Observable<CustomField> {
    return this.http.post<CustomField>(`${this.baseApiUrl}/AddCustomField/${collectionId}`, customField);
  }

  editCustomField(id: number, customField: CustomField): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/EditCustomField/${id}`, customField);
  }

  deleteCustomField(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/DeleteCustomField/${id}`);
  }

}
