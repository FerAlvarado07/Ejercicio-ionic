import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/cart.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  constructor(private cartService: CartService, public router: Router) {}

  ngOnInit() {
    this.getId();
    this.getCart();
  }
  userId: any;
  user: User = { id: '', name: '', password: '', email: '' };
  cart: Cart[] = [];
  getId(): void {
    console.log(localStorage.getItem('id'));
    this.userId = localStorage.getItem('id');
  }

  getCart(): void {
    console.log('Este es el cart son del usuario:', this.userId);
    this.cartService.getCart(this.userId).subscribe((cart) => {
      this.cart = cart;
    });
  }

  deleteProduct(item: Cart) {
    if (item.quantity === 1) {
      this.cartService.deleteProduct(item.id).subscribe(() => {
        this.cart = this.cart.filter((t) => t.id !== item.id);
        console.log('Tarea eliminada:', item);
      });
    } else {
      item.quantity = item.quantity - 1;
      console.log(item);

      this.cartService.updateProduct(item).subscribe();
    }
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

  redirectToCart() {
    this.router.navigate(['/cart']);
  }
  redirectToLogin() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
