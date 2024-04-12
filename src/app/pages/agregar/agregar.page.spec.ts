import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AgregarPage } from './agregar.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { of } from 'rxjs';
import { Product } from 'src/app/models/product.model';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    const productsServiceSpyObj = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'addProduct',
    ]);

    TestBed.configureTestingModule({
      declarations: [AgregarPage],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductsService, useValue: productsServiceSpyObj },
      ],
    }).compileComponents();

    productsServiceSpy = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProducts on ngOnInit', () => {
    const getProductsSpy = spyOn(component, 'getProducts');

    component.ngOnInit();

    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should call addProduct on addProduct', () => {
    const mockFormValue = { name: 'Product 1', description: 'Description 1' };
    component.form.setValue(mockFormValue);

    component.addProduct();

    expect(productsServiceSpy.addProduct).toHaveBeenCalledWith(
      'Product 1',
      'Description 1'
    );
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
