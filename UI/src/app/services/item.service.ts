import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  baseApiUrl: string = environment.baseApi;

  constructor(private http: HttpClient) { }

  getAllItems() {
    return this.http.get(`${this.baseApiUrl}/Items/GetAllItems`);
  }

  getItemsByCollection(collectionId: number) {
    return this.http.get<Item[]>(`${this.baseApiUrl}/Items/GetItemByCollection/${collectionId}`);
  }

  getItemById(id: number) {
    return this.http.get(`${this.baseApiUrl}/Items/GetItem/${id}`);
  }

  updateItem(id: number, body: any) {
    return this.http.put(`${this.baseApiUrl}/Items/UpdateItem/${id}`, body);
  }

  addItem(item: any, collectionId: number) {
    return this.http.post(`${this.baseApiUrl}/Items/AddItem/${item.id}?collectionId=${collectionId}`, item);
  }

  deleteItem(itemId: number) {
    return this.http.delete(`${this.baseApiUrl}/Items/DeleteItem/${itemId}`);
  }
}
