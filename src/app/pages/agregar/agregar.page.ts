import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private productService: ProductsService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {}
  userId: any = localStorage.getItem('id');
  error: boolean = false;
  products: Product[] = [];

  getProducts(): void {
    this.productService.getProducts(this.userId).subscribe((products) => {
      this.products = products;
    });
  }

  addProduct() {
    const name = this.form.get('name')?.value;

    const description = this.form.get('description')?.value;

    this.productService.addProduct(name, description);

    // Genera un timestamp único
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
