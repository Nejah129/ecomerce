import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
export const routes: Routes = [
  {
    path: 'product/get-one-product-by-id/:id',
    component: ProductDetailsComponent,
  },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'product/catigorey/:id', component: ProductListComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignUpFormComponent },

  { path: 'cart', component: CartDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },


  { path: '', component: ProductListComponent },

  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
