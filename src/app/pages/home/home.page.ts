import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private productsService: ProductsService,
    public router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getProducts();
    this.userId = localStorage.getItem('id');
  }
  userId: any;

  products: Product[] = [];

  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  getProducts(): void {
    this.productsService.getProducts(this.userId).subscribe((products) => {
      this.products = products;
    });
  }

  addToCart(product: Product) {
    this.presentToast('bottom');
    this.productsService.addTocart(product);
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

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Se agregó el producto al carrito',
      duration: 500,
      position: position,
    });

    await toast.present();
  }

  addProduct() {
    this.router.navigate(['/agregar']);
  }
}
