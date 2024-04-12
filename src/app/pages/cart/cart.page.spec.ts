import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartPage } from './cart.page';
import { CartService } from 'src/app/services/cart.service';
import { of } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    const cartServiceSpyObj = jasmine.createSpyObj('CartService', [
      'getCart',
      'deleteProduct',
      'updateProduct',
    ]);

    TestBed.configureTestingModule({
      declarations: [CartPage],
      imports: [RouterTestingModule],
      providers: [{ provide: CartService, useValue: cartServiceSpyObj }],
    }).compileComponents();

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getId and getCart on ngOnInit', () => {
    const getIdSpy = spyOn(component, 'getId');
    const getCartSpy = spyOn(component, 'getCart');

    component.ngOnInit();

    expect(getIdSpy).toHaveBeenCalled();
    expect(getCartSpy).toHaveBeenCalled();
  });

  it('should call deleteProduct and update cart on deleteProduct', () => {
    const mockItem: Cart = {
      id: 1,
      userId: 123,
      name: 'Product 1',
      description: 'Description 1',
      quantity: 2,
    };

    component.deleteProduct(mockItem);

    expect(cartServiceSpy.deleteProduct).toHaveBeenCalledWith(mockItem.id);
    expect(cartServiceSpy.updateProduct).toHaveBeenCalledWith({
      ...mockItem,
      quantity: 1,
    });
  });

  it('should navigate to /home on redirectToHome', () => {
    const routerNavigateSpy = spyOn(component.router, 'navigate');
    component.redirectToHome();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /cart on redirectToCart', () => {
    const routerNavigateSpy = spyOn(component.router, 'navigate');
    component.redirectToCart();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/cart']);
  });

  it('should clear localStorage and navigate to /login on redirectToLogin', () => {
    const localStorageClearSpy = spyOn(localStorage, 'clear');
    const routerNavigateSpy = spyOn(component.router, 'navigate');
    component.redirectToLogin();
    expect(localStorageClearSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
