import { ProductCategory } from './../../common/product-category';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../servies/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserServiceService } from '../../servies/user-service.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css'],
})
export class ProductCategoryMenuComponent {
  productCategories: ProductCategory[] = [];
  data: any;
  fileredCategory: ProductCategory | undefined;
  categorySelected = ProductCategory;
  id: number | undefined;
  token: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService
  ) {}
  ngOnInit(): void {
    this.listProductCategories();
    this.testData();
    this.userService.token$.subscribe((token) => {
      this.token = token;
    });
  }
  testData(): void {
    this.productService.getTestData().subscribe(
      (response) => {
        //  console.log('API Response:', response);
        this.data = response;
      },
      (error: HttpErrorResponse) => {
        // Type the error parameter
        console.error('API Error:', error);
      }
    );
  }
  listProductCategories() {
    this.productService.getProductList();
    this.productService.getProductCategories().subscribe((data: any) => {
      // console.log('product Categories =' + JSON.stringify(data));
      this.productCategories = data;
      // console.log(this.productCategories);
    });
  }
  getOneCatigoeryBuId(id: any) {
    this.productService.getOneCategoryById(id).subscribe((data: any) => {
      this.categorySelected = data;
      this.id = data.id;
      console.log(this.categorySelected);
      // console.log(this.testData())
      // console.log(this.id);
      this.productService.setCategoryId(id);
      this.productService.getProductList();
      this.router.navigate(['product/catigorey', id]);
    });
  }
  // getProductCategoryById(id: number) {
  //   this.productService.getProductsByCategoryById(id).subscribe((data: any) => {
  //     // console.log('product Category =' + JSON.stringify(data));
  //     this.fileredCategory = data;
  //   });
  // }
}
