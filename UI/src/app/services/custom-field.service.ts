import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../environments/environment';
import { CustomField, FieldType } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})

export class CustomFieldService {

  baseApiUrl: string = environment.baseApi
  constructor(private http: HttpClient) { }

  getFieldType(fieldType: FieldType): string {
  const fieldTypes = {
    [FieldType.String]: 'String',
    [FieldType.Int]: 'Integer',
    [FieldType.Text]: 'Text',
    [FieldType.Boolean]: 'Boolean',
    [FieldType.Date]: 'Date'
  };
  return fieldTypes[fieldType] || '';
}


  getCustomFields(collectionId: number): Observable<CustomField[]> {
    return this.http.get<CustomField[]>(`${this.baseApiUrl}/CustomField/GetCustomFields/${collectionId}`);
  }

  getCustomFiled(id: number): Observable<CustomField> {
    return this.http.get<CustomField>(`${this.baseApiUrl}/CustomField/GetCustomField/${id}`);
  }

  addCustomField(collectionId: number, customField: CustomField): Observable<CustomField> {
    return this.http.post<CustomField>(`${this.baseApiUrl}/CustomField/AddCustomField/${collectionId}`, customField);
  }

  editCustomField(id: number, customField: CustomField): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/CustomField/EditCustomField/${id}`, customField);
  }

  deleteCustomField(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/CustomField/DeleteCustomField/${id}`);
  }
}
