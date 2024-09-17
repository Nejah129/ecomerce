import { ProductService } from './servies/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HttpClient } from '@angular/common/http';
import { Product } from './common/product';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { UserServiceService } from './servies/user-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    RouterOutlet,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    NgbModule,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    ReactiveFormsModule,
    LoginFormComponent,
    SignUpFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  constructor(
    private router: Router,
    private productService: ProductService,
    private httpClient: HttpClient,
    private userService: UserServiceService
  ) {}
  ngOnInit(): void {
    this.getData();
    this.userService.token$.subscribe((token) => {
      this.token = token;
    });
  }

  title = '03-front-end-angular';
  goHome() {
    this.router.navigate(['/']);
    this.httpClient.get<Product[]>(`http://localhost:8080/api/product/get-all`);
  }
  getData(): any {
    this.token = localStorage.getItem('token');
    console.log(this.token);
  }
}
