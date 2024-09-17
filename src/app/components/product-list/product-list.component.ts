import { ProductCategory } from './../../common/product-category';
import { ProductService } from './../../servies/product.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../common/product';
import { CommonModule, DatePipe } from '@angular/common';
import {
  HttpClientModule,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import {
  FilterMatchMode,
  FilterService,
  PrimeNGConfig,
  SelectItem,
  TreeNode,
} from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../servies/cart.service';
// import { ImportsModule } from './imports';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
    RouterModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    TreeTableModule,
    PaginatorModule,
    ProgressBarModule,
    SliderModule,
    HttpClientModule,
  ],
  styles: [],

  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  public tempId: any;
  public editId: any;
  public rows = [];
  public srch = [];

  public products: Array<any> = [];
  isLoading = false;
  totalItems = 0;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');
  public editFromDate: any;
  public editToDate: any;
  loaded = false;

  @ViewChild('dt1') dt1!: Table;
  cols = ['name', 'picture', 'unitPrice', 'unitStock'];
  totalRecords = 0;
  loading = false;
  matchModeOptions: SelectItem[] | undefined;

  //new
  dataProduct: any;
  productCategories: ProductCategory[] = [];

  oneCatigery!: ProductCategory | undefined;
  catigoeryId: number | undefined;
  searchMode: boolean = false;
  searchKeyword: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements!: number;
  first = 0;
  searchValue: string = '';

  files!: TreeNode[];

  filteredProducts = [...this.products];

  constructor(
    private productService: ProductService,
    private router: Router,
    private filterService: FilterService,
    private primengConfig: PrimeNGConfig,

    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const customFilterName = 'custom-equals';
    this.filterService.register(
      customFilterName,
      (
        value: { toString: () => any } | null | undefined,
        filter: string | null | undefined
      ): boolean => {
        if (filter === undefined || filter === null || filter.trim() === '') {
          return true;
        }

        if (value === undefined || value === null) {
          return false;
        }

        return value.toString() === filter.toString();
      }
    );
    this.matchModeOptions = [
      { label: 'Custom Equals', value: customFilterName },
      { label: 'Starts With', value: FilterMatchMode.STARTS_WITH },
      { label: 'Contains', value: FilterMatchMode.CONTAINS },
    ];
    this.productService.currentKeyword.subscribe((keyword) => {
      this.searchKeyword = keyword;
      if (this.searchKeyword) {
        this.searchMode = true;
        this.handSearchproduct(this.searchKeyword);
      } else {
        this.productService.categoryId$.subscribe((id) => {
          this.catigoeryId = id;
          if (this.catigoeryId !== undefined) {
            this.getListOfProductsFilteredByCatigoery(this.catigoeryId);
            console.log(this.catigoeryId);
          } else {
            this.getAllProducts();
          }
        });
      }
    });
    // this.handleGetProductWithPagination(this.pageNumber, this.pageSize);
    this.testData();
    this.productService.getProductList().subscribe((files: Product[]) => files);
  }
  detailsProduct(id: number) {
    console.log('******************');
    this.router.navigate(['/product/get-one-product-by-id/', id]);
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe((data: any) => {
      console.log('product Categories =' + JSON.stringify(data));
      this.productCategories = data;
    });
  }
  getListOfProductsFilteredByCatigoery(id: number) {
    this.productService.getProductsByCategoryById(id).subscribe((data: any) => {
      this.products = data;
    });
    // console.log(id);
  }

  // handleListProduct() {
  //   this.productService.getProductList().subscribe((dataProduct) => {
  //     this.products = dataProduct.products;
  //     console.log(this.products);
  //     console.log(`Page: ${dataProduct.page}, Size: ${dataProduct.size}`);
  //   });
  // }
  handSearchproduct(keyword: string) {
    this.productService.searchproduct(keyword).subscribe({
      next: (data: Product[]) => (this.products = data),
      error: (err) => console.error('Error searching products', err),
    });
    console.log('Searching for keyword:', keyword);
  }
  // handleGetProductWithPagination(thePageNumber: number, thePageSize: number) {
  //   this.productService
  //     .getProductsListPaginate(thePageNumber - 1, thePageSize)
  //     .subscribe((data) => {
  //       this.products = data.products;
  //       this.pageNumber = data.page + 1;
  //       this.pageSize = data.size;
  //       this.totalElements = data.totalElements;
  //       console.log(data);
  //     });
  // }
  testData(): void {
    this.productService.getTestData().subscribe(
      (response) => {
        // console.log('API Response:', response);
        this.dataProduct = response; // Use `this.data` to store the API response
      },
      (error: HttpErrorResponse) => {
        // Type the error parameter
        console.error('API Error:', error);
      }
    );
  }

  // onTablePage(event: any) {
  //   this.pageNumber = event.first / event.rows + 1;
  //   this.pageSize = event.rows;
  //   this.handleGetProductWithPagination(this.pageNumber, this.pageSize);
  // }
  doSearch(value: string) {
    this.productService.updateKeyword(value); // Update the keyword in the shared service
    this.router.navigateByUrl(`/search/${value}`);
  }
  onSubmit(event: Event, value: string): void {
    event.preventDefault();
    this.doSearch(value);
    console.log('Form submission prevented  value', value);
  }
  onFilterChange(filterValue: string) {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  getAllProducts(): void {
    this.productService.getProductList().subscribe((dataProduct) => {
      this.products = dataProduct;
      this.totalRecords = dataProduct.length;
      this.primengConfig.ripple = true;
      // console.log('-------------------------');
      // console.log(dataProduct);
    });
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  addToCart(product: Product) {
    // console.log(product);
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
    // console.log(this.cartService.totalQuantity)
  }
}
