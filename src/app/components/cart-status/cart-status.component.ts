import { UserServiceService } from './../../servies/user-service.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../servies/cart.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { User } from '../../common/user';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [FontAwesomeModule, ButtonModule, CommonModule],
  templateUrl: './cart-status.component.html',
  styleUrl: '../../app.component.css',
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  token: string | undefined | null = localStorage.getItem('token');
  user: any = localStorage.getItem('user');

  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserServiceService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.updateStatus();
  
    this.userService.token$.subscribe(token => {
      this.token = token;
    });
    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user)
    });
   
  }
  updateStatus() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;

      let totalPriceEdit = Math.round(this.totalPrice * 100) / 100;
      // console.log('-----------------------------------aaa', aaa)
      // this.totalPrice = this.decimalPipe.transform(99.999999999, '1.2-2')
      this.totalPrice = totalPriceEdit;
    });
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }
  goToCart() {
    this.router.navigate(['/cart']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  getData(): void {
    // Retrieve token from localStorage
    this.token = localStorage.getItem('token') || '';

    // Retrieve user data from localStorage
    const userData = localStorage.getItem('user');
   

    try {
      // Parse user data only if it exists
      if (userData) {
        this.user = JSON.parse(userData);
        this.cdr.detectChanges();
      } else {
        this.user = null; // Or handle as appropriate
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.user = null; // Handle the error case appropriately
    }

    // Log the user data if it exists
    if (this.user) {
      console.log(this.user);
      console.log(this.user.firstName);
    } else {
      console.log('User data is not available or invalid.');
    }
  }
  clearAllData(): void {
    this.userService.clearAuthData();
  }
}
