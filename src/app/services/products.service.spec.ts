import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService, { provide: Router, useValue: routerSpyObj }],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
    };
    const mockCart: Cart[] = [
      {
        id: 1,
        userId: 1,
        name: 'Product 1',
        description: 'Description 1',
        quantity: 1,
      },
    ];

    spyOn(service.http, 'get').and.returnValue(of(mockCart));

    service.addTocart(mockProduct);

    expect(service.http.post).toHaveBeenCalled();
  });
});
