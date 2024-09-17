// import { ProductCategory } from './../common/product-category';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Product } from '../common/product';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   private baseUrl = 'http://localhost:8080/api';
//   constructor(private httpClient: HttpClient) { }

//   getProductList(): Observable<Product[]> {
//     // edit backend to add search with cateorgy
//     return this.httpClient.get<Product[]>(`${this.baseUrl}/product/get-all-products`).pipe(
//       map(response => {
//         // Assuming response is an array of products directly
//         return response;
//       })
//     );
//   }
//   getTestData(): Observable<any> {
//     // console.log("test Data",this.httpClient.get<any>(`${this.baseUrl}/product-category/get-one-category-by-id?id=3`))
//     return this.httpClient.get<any>(`${this.baseUrl}/product-category/get-one-category-by-id?id=3`);
//   }
//   getProductCatigoreys() :Observable<ProductCategory[]> {
//     try {
//       return this.httpClient.get<ProductCategory[]>(`${this.baseUrl}/product-category/get-all-categorys`).pipe(
//         map(response => {
//           console.log("++++++++++++");
//           // Assuming response is an array of products Categories directly
//           return response;
//         })
//       );
//     } catch (error) {
//       console.log(error);
//       throw new Error('Method getProductCatigoreys not implemented.'+error);
//     }
//   }
//   getOneCatigoryById(id:number):Observable<ProductCategory>{
//     try {
//       return this.httpClient.get<ProductCategory>(`${this.baseUrl}/product-category/get-one-category-by-id?id=${id}`)
//     } catch (error) {
//       console.log(error);
//       throw new Error('Method getProductCatigoreys not implemented.'+error);
//     }
//   }
//   getProductsByCatigoreyById(currentCategoryId:number) :Observable<Product[]> {
//     try {
//       return this.httpClient.get<Product[]>(`${this.baseUrl}/product/catigorey?id=${currentCategoryId}`).pipe(
//         map(response => {
//           // Assuming response is an array of products Categories directly
//           return response;
//         })
//       );
//     } catch (error) {
//       console.log(error);
//       throw new Error('Method getProductCatigoreys not implemented.'+error);
//     }
//   }
// }

// // console.log(getProductList);
// interface GetResponseProduct {
//   _embedded: {
//     products: Product[];
//   }
// }

// interface GetResponseProductCategory {
//   _embedded: {
//     productCategory: ProductCategory[];
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedProductResponse, Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api';
  private categoryIdSource = new BehaviorSubject<number | undefined>(undefined);
  categoryId$ = this.categoryIdSource.asObservable();
  private keywordSource = new BehaviorSubject<string>('');
  currentKeyword = this.keywordSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  getProductList(): Observable<Product[]> {
   
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/product/get-all`
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(
      `${this.baseUrl}/product-category/get-all-categorys`
    );
  }

  getOneCategoryById(id: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(
      `${this.baseUrl}/product-category/get-one-category-by-id?id=${id}`
    );
  }

  getProductsByCategoryById(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/product/catigorey?id=${categoryId}`
    );
  }

  getTestData(): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/product/get-all`
    );
  }

  getProductsListPaginate( thePage:number,thePageSize:number): Observable<PaginatedProductResponse> {
    return this.httpClient.get<PaginatedProductResponse>(
      `${this.baseUrl}/product/get-all-products?page=${thePage}&size=${thePageSize}`
    );
  }
  

  setCategoryId(id: number | undefined): void {
    this.categoryIdSource.next(id);
  }
  updateKeyword(keyword: string) {
    this.keywordSource.next(keyword);
  }
  searchproduct(theKeyWord: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/product/findProdctByName?name=${theKeyWord}`
    );
  }
  getOneProductByIdForDetails(id:any):Observable<Product>{
    return this.httpClient.get<Product>(`${this.baseUrl}/product/get-one-product-by-id/${id}`)
  }
  getProductListWithPagination(page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/product/get-all-products?page=${page}&size=${size}`
    );
  }
 
}
