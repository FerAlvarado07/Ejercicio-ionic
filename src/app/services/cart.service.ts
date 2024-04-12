import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private router: Router, public http: HttpClient) {}

  public apiCart = 'http://localhost:3000/cart';

  getCart(userId: any): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiCart}?userId=${userId}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiCart}/${id}`);
  }

  updateProduct(item: Cart): Observable<Task> {
    return this.http.put<Task>(`${this.apiCart}/${item.id}`, item);
  }
}
