import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servies/product.service';
import { Product } from '../../common/product';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../servies/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productId: number | undefined;
  product!: Product|undefined ;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService,
    private cartService: CartService,
    private router:Router

  ) {}

  ngOnInit(): void {
    // Retrieve the product ID from the route parameter
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log(id);
      if (id) {
        this.getProductById(+id);
        console.log(this.product);
      } else {
        console.error('Product ID is missing in the route.');
      }
    });
    this.getAllList();
  }

  getProductById(id: number): void {
    this.productService.getOneProductByIdForDetails(id).subscribe({
      next: (data) => {
        this.product = data;
        console.log(this.product);
      },

      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }
  getAllList() {
    // this.productService
    //   .getProductList()
    //   .subscribe((dataProduct) => (this.products = dataProduct));
    // console.log('---------------');
  }
  addToCart(product: Product) {
    // console.log(product);
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
    console.log(this.cartService.totalQuantity)
  }
  goHome() {
    this.router.navigate(['/']);
    }
}
