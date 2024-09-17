import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../servies/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ProductService } from '../../servies/product.service';
import { CartItem } from '../../common/cart-item';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent implements OnInit {
  products: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,

   private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    this.products = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe((price) => {
      this.totalPrice = price;
      // this.totalPrice = Math.round(this.totalPrice* 100) / 100;
      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    });
    this.cartService.totalQuantity.subscribe((quantity) => {
      this.totalQuantity = quantity;
    });
  }
  handleMinus(product: CartItem) {
    this.cartService.minusQuantity(product);
  }
  handlePlus(product: CartItem) {
    this.cartService.plusQuantity(product);
    // console.log(product);
  }
  handleDelete(product: CartItem) {
    this.cdr.detectChanges();
    this.cartService.deleteProductFromCart(product);
    this.getAllProducts();
  }
  goToCheckout() {
    this.router.navigate(["/checkout"]);
    }
}
