import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  userId: any;
  constructor(public http: HttpClient, private router: Router) {
    this.userId = localStorage.getItem('id');
  }

  public apiProducts = 'http://localhost:3000/products';
  public apiCart = 'http://localhost:3000/cart';

  getProducts(useId: any): Observable<Product[]> {
    return this.http.get<any>(`${this.apiProducts}`);
  }

  addProduct(name: string, description: string) {
    const products = this.http.get<any>(this.apiProducts);
    products.subscribe((products) => {
      let maxId = -Infinity;

      for (let i = 0; i < products.length; i++) {
        if (products[i].id > maxId) {
          maxId = products[i].id;
        }
      }
      console.log(products);
      const newId: number = Number(maxId) + 2;
      console.log(newId);
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: name,
        description: description,
      };
      console.log(name, description);
      console.log(newProduct);
      this.http.post<Product>(`${this.apiProducts}`, newProduct).subscribe();
    });
  }

  addTocart(product: Product) {
    const cart = this.http.get<any>(this.apiCart);
    cart.subscribe((cart) => {
      const exist = cart.find((item: any) => {
        return item.name === product.name;
      });

      console.log(exist);

      if (exist === undefined) {
        let maxId = -Infinity;

        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id > maxId) {
            maxId = cart[i].id;
          }
        }
        console.log(cart);
        const newId: number = Number(maxId) + 1;
        const id: any = localStorage.getItem('id');
        const newCart: Cart = {
          id: newId,
          userId: id,
          name: product.name,
          description: product.description,
          quantity: 1,
        };
        this.http.post<Cart>(`${this.apiCart}`, newCart).subscribe();
      } else {
        exist.quantity = exist.quantity + 1;

        console.log(exist);
        this.http.put<Cart>(`${this.apiCart}/${exist.id}`, exist).subscribe();
      }
    });
  }
}
