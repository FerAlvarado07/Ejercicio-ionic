import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { Cart } from '../models/cart.model';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService, { provide: Router, useValue: routerSpyObj }],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart items for a user', () => {
    const mockUserId = '123';
    const mockCart: Cart[] = [
      {
        id: 1,
        userId: 1,
        name: 'Product 1',
        description: 'Description 1',
        quantity: 2,
      },
    ];

    service.getCart(mockUserId).subscribe((cartItems) => {
      expect(cartItems).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${service.apiCart}?userId=${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should delete a product from the cart', () => {
    const mockProductId = 1;

    service.deleteProduct(mockProductId).subscribe(() => {
      // Verificar que la solicitud DELETE se haya hecho correctamente
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/cart']);
    });

    const req = httpMock.expectOne(`${service.apiCart}/${mockProductId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update a product in the cart', () => {
    const mockCart: Cart = {
      id: 1,
      userId: 1,
      name: 'Product 1',
      description: 'Description 1',
      quantity: 2,
    };

    service.updateProduct(mockCart).subscribe(() => {
      // Verificar que la solicitud PUT se haya hecho correctamente
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/cart']);
    });

    const req = httpMock.expectOne(`${service.apiCart}/${mockCart.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
