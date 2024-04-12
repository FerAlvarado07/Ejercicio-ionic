import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { ToastController } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { CartService } from 'src/app/services/cart.service';
import { of } from 'rxjs';
import { Product } from 'src/app/models/product.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    const productsServiceSpyObj = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'addTocart',
    ]);
    const toastControllerSpyObj = jasmine.createSpyObj('ToastController', [
      'create',
      'present',
    ]);
    const cartServiceSpyObj = jasmine.createSpyObj('CartService', ['']);

    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpyObj },
        { provide: ToastController, useValue: toastControllerSpyObj },
        { provide: CartService, useValue: cartServiceSpyObj },
      ],
    }).compileComponents();

    productsServiceSpy = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    toastControllerSpy = TestBed.inject(
      ToastController
    ) as jasmine.SpyObj<ToastController>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProducts on ngOnInit', () => {
    component.userId = '123';
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1' },
    ];
    productsServiceSpy.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productsServiceSpy.getProducts).toHaveBeenCalledWith('123');
    expect(component.products).toEqual(mockProducts);
  });

  it('should call addTocart and presentToast on addToCart', async () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
    };

    toastControllerSpy.create.and.returnValue(
      Promise.resolve({ present: () => {} } as HTMLIonToastElement)
    );

    await component.addToCart(mockProduct);

    expect(productsServiceSpy.addTocart).toHaveBeenCalledWith(mockProduct);
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Se agregó el producto al carrito',
      duration: 500,
      position: 'bottom',
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

  it('should navigate to /agregar on addProduct', () => {
    const routerNavigateSpy = spyOn(component.router, 'navigate');
    component.addProduct();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/agregar']);
  });
});
